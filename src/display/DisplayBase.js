module.exports = DisplayBase;

var C_DISPLAY = 'd3stream-display';
var C_SVG = 'd3stream-svg';
var C_PLOT = 'd3stream-plot';

var U = require('../utility.js');
var DU = require('./utility.js');
var config = require('../config.js');
var StreamTransform = require('../StreamTransform.js');
var Select = require('./Select.js');

function DisplayBase(d3, element, options, data, parent, b) {
  StreamTransform.call(this, data);
  this.d3 = d3;
  this.config = Object.assign({}, config, options);
  this.b = b || 0;
  this.display = parent ? parent.display : createDisplay(d3, element, this.config);
  this.size = parent ? parent.size : { width: 0, height: 0, inWidth: 0, inHeight: 0 };
  this.select = parent ? parent.select : new Select(d3, this.config);
  this.charts = [];
  this.frames = [];
  this.branches = [];
}

DisplayBase.prototype = Object.create(StreamTransform.prototype);
DisplayBase.prototype.constructor = DisplayBase;

DisplayBase.prototype.update = function (data, baxis) {
  if (data !== undefined) {
    this.data = data;
  }
  this.size = getSize(this.display, this.config);
  this.select.clear();

  var transformedData = this.unstream() || [];
  var packedData = (transformedData.length == 0 || !Array.isArray(transformedData[0])) ?
    [transformedData] : transformedData;
  var axis = baxis || DU.axis(this, packedData, this.config);

  this.branches.forEach(function (branch, i) {
    branch.update(transformedData, axis);
  });

  var self = this;
  this.charts.forEach(function (chart, i) {
    var plots = packedData.map(function (d, r) {
      return getPlot(self.display, self.select, self.size, self.config, i, r, self.b);
    });
    chart[0](self, plots, axis, packedData, chart[1]);
    var r = packedData.length;
    while (removePlot(self.display, self.config, i, r, self.b)) r += 1;
  });

  this.frames.forEach(function (frame, i) {
    frame[0](self, axis, packedData, frame[1]);
  });

  if (this.config.update) {
    this.config.update(this, transformedData);
  }
};

DisplayBase.prototype.addChart = function (chartFunction, options) {
  this.charts.push([chartFunction, Object.assign({}, this.config, options)]);
  return this;
};

DisplayBase.prototype.addFrame = function (frameFunction, options) {
  this.frames.push([frameFunction, Object.assign({}, this.config, options)]);
  return this;
};

DisplayBase.prototype.addBranch = function(cls) {
  var d = new cls(this.d3, null, this.config, this.data, this, this.branches.length + 1);
  this.branches.push(d);
  return d;
}

DisplayBase.prototype.axis = function (data, variable) {
  var domain = this.domain(data, variable);
  var axis = {
    variable: variable,
    baseVariable: '_b' + variable,
    missing: domain.missing,
    config: domain.config,
    domain: domain.domain,
    scale: domain.scale ? domain.scale : this.d3.scaleLinear().domain(domain.domain).nice(),
    pick: function (d, w) { return picker(this.scale, d, this.variable, w); },
    pickBase: function (d, w) { return picker(this.scale, d, this.baseVariable, w, 0); },
    pickDistance: function (d) { return Math.abs(this.pickBase(d) - this.pick(d)); },
    pickValue: function (d) { return Math.abs(d[this.variable] - (d[this.baseVariable] || 0)); },
    pickZero: function () { return this.scale(0); },
    pickMin: function () { return this.scale(this.domain[0]); }
  };
  return axis;

  function picker(scale, d, k, w, a) {
    var v = d[k] !== undefined ? d[k] : a;
    if (v === undefined) return v;
    return scale(v) + (scale.bandwidth ?
      (w !== undefined ? 0 : scale.bandwidth() / 2) :
      (w !== undefined ? -w : 0));
  }
};

DisplayBase.prototype.domain = function (data, variable) {
  return { domain: [0, 1] };
};

function createDisplay(d3, element, options) {
  if (typeof jQuery == 'function' && element instanceof jQuery) {
    element = element[0];
  }
  element = d3.select(element);
  var display = element.append('div');
  display.classed(DU.a(C_DISPLAY, options.class), true);
  return display;
}

function getSize(element, options) {
  var width = options.width || element.node().offsetWidth;
  var height = options.height || element.node().offsetHeight;
  return {
    width: width,
    height: height,
    inWidth: width - options.marginLeft - options.marginRight,
    inHeight: height - options.marginTop - options.marginBottom,
  };
}

function getPlot(display, select, size, options, i, r, b) {
  var clsSvg = [C_SVG, options.combine ? 1 : r].join('-');
  var svg = display.select(DU.s(clsSvg));
  if (svg.empty()) {
    svg = display.append('svg').attr('class', DU.a(C_SVG, clsSvg));
    select.register(svg);
  }
  svg.attr('width', size.width).attr('height', size.height);

  var clsPlot = [C_PLOT, b, r, i].join('-');
  var plot = svg.select(DU.s(clsPlot));
  if (plot.empty()) {
    plot = svg.append('g')
      .attr('class', DU.a(C_PLOT, clsPlot))
      .attr('transform', DU.translateMargins(options));
  }
  return plot;
}

function removePlot(display, options, i, r, b) {
  var clsSvg = [C_SVG, options.combine ? 1 : r].join('-');
  var svg = display.select(DU.s(clsSvg));
  if (svg.empty()) return false;
  if (!options.combine) {
    svg.remove();
    return true;
  }

  var clsPlot = [C_PLOT, b, r, i].join('-');
  var plot = svg.select(DU.s(clsPlot));
  if (plot.empty()) return false;
  plot.remove();
  return true;
}
