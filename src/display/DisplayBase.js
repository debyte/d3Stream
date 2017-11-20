module.exports = DisplayBase;

var C_DISPLAY = 'd3stream-display';
var C_SVG = 'd3stream-svg';
var C_PLOT = 'd3stream-plot';

var U = require('../utility.js');
var DU = require('./utility.js');
var config = require('../config.js');
var StreamTransform = require('../StreamTransform.js');
var Select = require('./Select.js');

function DisplayBase(element, options, data) {
  StreamTransform.call(this, data);
  this.config = U.assign(config, options);
  this.display = createDisplay(element, this.config);
  this.size = { width: 0, height: 0, inWidth: 0, inHeight: 0 };
  this.select = new Select(this.config);
  this.axisCache = {};
  this.charts = [];
  this.frames = [];
}

DisplayBase.prototype = Object.create(StreamTransform.prototype);
DisplayBase.prototype.constructor = DisplayBase;

DisplayBase.prototype.update = function (data) {
  if (data !== undefined) {
    this.data = data;
  }
  this.size = getSize(this.display, this.config);
  this.select.clear();
  this.axisCache = {};

  var transformedData = this.array();
  if (transformedData.length > 0 && !Array.isArray(transformedData[0])) {
    transformedData = [transformedData];
  }

  for (i = 0; i < this.charts.length; i++) {
    for (var r = 0; r < transformedData.length; r++) {
        var plot = getPlot(this.display, this.select, this.size, this.config, i, r);
        var chart = this.charts[i];
        chart[0](this, plot, transformedData, r, chart[1]);
    }
    while (removePlot(this.display, this.config, i, r)) r += 1;
  }

  for (i = 0; i < this.frames.length; i++) {
    var frame = this.frames[i];
    frame[0](this, transformedData, frame[1]);
  }

  if (this.config.update) {
    this.config.update(this, transformedData);
  }
};

DisplayBase.prototype.addChart = function (chartFunction, options) {
  this.charts.push([chartFunction, U.assign(this.config, options)]);
  this.update();
  return this;
};

DisplayBase.prototype.addFrame = function (frameFunction, options) {
  this.frames.push([frameFunction, U.assign(this.config, options)]);
  this.update();
  return this;
};

DisplayBase.prototype.axis = function (data, variable) {
  if (this.axisCache[variable]) {
    return this.axisCache[variable];
  }
  var domain = this.domain(data, variable);
  var axis = {
    variable: domain.variable || variable,
    domain: domain.domain,
    scale: domain.band ?
      d3.scaleBand().domain(domain.domain).padding(this.config.bandPadding) :
      d3.scaleLinear().domain(domain.domain).nice(),
    pick: domain.band ? pickBand : pickLinear,
  };
  this.axisCache[variable] = axis;
  return axis;

  function pickBand(d, w) {
    if (w !== undefined) return this.scale(d[this.variable]);
    return this.scale(d[this.variable]) + this.scale.bandwidth() / 2;
  }

  function pickLinear(d, w) {
    if (w) return this.scale(d[this.variable]) - w;
    return this.scale(d[this.variable]);
  }
};

DisplayBase.prototype.domain = function (data, variable) {
  return { domain: [0, 1] };
};

function createDisplay(element, options) {
  if (jQuery && element instanceof jQuery) {
    element = element[0];
  }
  element = d3.select(element);
  display = element.append('div');
  display.classed(DU.a(C_DISPLAY, options.class), true);
  return display;
}

function getSize(element, options) {
  var width = options.width || element.node().offsetWidth;
  var height = options.height || element.node().offsetHeight;
  return {
    width: width,
    height: height,
    inWidth: width - options.marginLeft - options.marginRight,
    inHeight: height - options.marginTop - options.marginBottom,
  };
}

function getPlot(display, select, size, options, i, r) {
  var clsSvg = [C_SVG, options.combine ? 1 : r].join('-');
  var svg = display.select(DU.s(clsSvg));
  if (svg.empty()) {
    svg = display.append('svg').attr('class', DU.a(C_SVG, clsSvg));
    select.register(svg);
  }
  svg.attr('width', size.width).attr('height', size.height);

  var clsPlot = [C_PLOT, r, i].join('-');
  var plot = svg.select(DU.s(clsPlot));
  if (plot.empty()) {
    plot = svg.append('g')
      .attr('class', DU.a(C_PLOT, clsPlot))
      .attr('transform', DU.translateMargins(options));
  }
  return plot;
}

function removePlot(display, options, i, r) {
  var clsSvg = [C_SVG, options.combine ? 1 : r].join('-');
  var svg = display.select(DU.s(clsSvg));
  if (svg.empty()) return false;
  if (!options.combine) {
    svg.remove();
    return true;
  }

  var clsPlot = [C_PLOT, r, i].join('-');
  var plot = svg.select(DU.s(clsPlot));
  if (plot.empty()) return false;
  plot.remove();
  return true;
}
