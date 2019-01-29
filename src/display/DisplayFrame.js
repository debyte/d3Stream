module.exports = DisplayFrame;

var C_AXIS_X = 'd3stream-axis-x';
var C_AXIS_Y = 'd3stream-axis-y';
var C_LABELS = 'd3stream-labels';

var U = require('../utility.js');
var DU = require('./utility.js');
var DisplayBase = require('./DisplayBase.js');

function DisplayFrame(d3, element, options, data) {
  DisplayBase.call(this, d3, element, options, data);
  this.domainFunction = {};
}

DisplayFrame.prototype = Object.create(DisplayBase.prototype);
DisplayFrame.prototype.constructor = DisplayFrame;

DisplayFrame.prototype.domain = function (data, variable) {
  if (this.domainFunction[variable]) {
    return this.domainFunction[variable](this.d3, data, variable);
  } else {
    return domainExtent(this.d3, data, variable);
  }
};

DisplayFrame.prototype.setDomain = function (variables, domainFunction) {
  for (var i = 0; i < variables.length; i++) {
    this.domainFunction[variables[i]] = domainFunction;
  }
  return this;
};

function domainExtent(d3, data, variable) {
  return { domain: d3.extent(d3.merge(data), U.pick(variable)) };
}

DisplayFrame.prototype.domainManual = function (variables, range) {
  return this.setDomain(variables, function (d3, data, variable) {
    return { domain: range };
  });
};

DisplayFrame.prototype.domainPad = function (variables, padding) {
  if (!Array.isArray(padding)) {
    padding = [padding, padding];
  }
  return this.setDomain(variables, function (d3, data, variable) {
    var extent = domainExtent(d3, data, variable).domain;
    return { domain: [ extent[0] - padding[0], extent[1] + padding[1] ]};
  });
};

DisplayFrame.prototype.domainIQR = function (variables) {
  return this.setDomain(variables, function (d3, data, variable) {
    var sorted = U.map(d3.merge(data), U.pick(variable)).sort();
    var q1 = sorted[Math.floor(0.25 * sorted.length)];
    var q3 = sorted[Math.floor(0.75 * sorted.length)];
    var iqr = q3 - q1;
    return { domain: [
      Math.max(q1 - 1.5 * iqr, sorted[0]),
      Math.min(q3 + 1.5 * iqr, sorted[sorted.length - 1])
    ]};
  });
};

DisplayFrame.prototype.domainBands = function (variables, bandVariable, bands) {
  return this.setDomain(variables, function (d3, data, variable) {
    bands = U.unstream(bands);
    var def = { band: true, variable: bandVariable };
    if (bands instanceof Array) {
      def.domain = bands;
    } else {
      def.domain = U.unique(U.map(d3.merge(data), U.pick(bandVariable)));
      if (bands instanceof Object) {
        def.config = bands;
      }
    }
    return def;
  });
};

DisplayFrame.prototype.addAxis = function (horizontalVariable, verticalVariable) {
  if (horizontalVariable) {
    this.addFrame(makeAxisBottom, { variable: horizontalVariable });
  }
  if (verticalVariable) {
    this.addFrame(makeAxisLeft, { variable: verticalVariable });
  }
  return this;
};

DisplayFrame.prototype.labels = function (labels) {
  return this.addFrame(makeLabels, { labels: labels });
};

function makeAxisBottom(display, data, options) {
  var axis = display.axis(data, options.variable);
  display.display.selectAll('svg').each(function() {
    var svg = display.d3.select(this);
    var g = svg.select(DU.s(C_AXIS_X));
    if (!g.empty()) {
      g.remove();
    }
    g = svg.append('g').attr('class', C_AXIS_X);
    var d3axis = display.d3.axisBottom(axis.scale.range([0, display.size.inWidth]));
    axisConfig(axis, d3axis);
    g.attr('transform', DU.translateMargins(options, 0, display.size.inHeight))
      .call(d3axis);
  });
}

function makeAxisLeft(display, data, options) {
  var axis = display.axis(data, options.variable);
  display.display.selectAll('svg').each(function() {
    var svg = display.d3.select(this);
    var g = svg.select(DU.s(C_AXIS_Y));
    if (!g.empty()) {
      g.remove();
    }
    g = svg.append('g').attr('class', C_AXIS_Y);
    var d3axis = display.d3.axisLeft(axis.scale.range([display.size.inHeight, 0]));
    axisConfig(axis, d3axis);
    g.attr('transform', DU.translateMargins(options))
      .call(d3axis);
  });
}

function axisConfig(axis, d3axis) {
  if (axis.config) {
    d3axis.tickFormat(function (x) {
      var c = axis.config[x] || {};
      return c.label || x;
    });
  }
}

function makeLabels(display, data, options) {
  if (data.length == 0) return;
  var div = display.display.select(DU.s(C_LABELS));
  if (div.empty()) {
    div = display.display.append('div').attr('class', C_LABELS);
  } else {
    div.selectAll('span').remove();
  }
  for (var i = 0; i < options.labels.length; i++) {
    div.append('span')
      .attr('class', 'label-dot d3stream-group-' + i);
    div.append('span')
      .html(options.labels[i]);
  }
}
