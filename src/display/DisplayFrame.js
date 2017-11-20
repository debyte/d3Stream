module.exports = DisplayFrame;

var C_AXIS_X = 'd3stream-axis-x';
var C_AXIS_Y = 'd3stream-axis-y';
var C_LABELS = 'd3stream-labels';

var U = require('../utility.js');
var DU = require('./utility.js');
var DisplayBase = require('./DisplayBase.js');

function DisplayFrame(element, options, data) {
  DisplayBase.call(this, element, options, data);
  this.domainFunction = {};
}

DisplayFrame.prototype = Object.create(DisplayBase.prototype);
DisplayFrame.prototype.constructor = DisplayFrame;

DisplayFrame.prototype.domain = function (data, variable) {
  if (this.domainFunction[variable]) {
    return this.domainFunction[variable](data, variable);
  } else {
    return domainExtent(data, variable);
  }
};

DisplayFrame.prototype.setDomain = function (variables, domainFunction) {
  for (var i = 0; i < variables.length; i++) {
    this.domainFunction[variables[i]] = domainFunction;
  }
  return this;
};

function domainExtent(data, variable) {
  return { domain: d3.extent(d3.merge(data), U.pick(variable)) };
}

DisplayFrame.prototype.domainManual = function (variables, range) {
  return this.setDomain(variables, function (data, variable) {
    return { domain: range };
  });
};

DisplayFrame.prototype.domainPad = function (variables, padding) {
  if (!Array.isArray(padding)) {
    padding = [padding, padding];
  }
  return this.setDomain(variables, function (data, variable) {
    var extent = domainExtent(data, variable).domain;
    return { domain: [ extent[0] - padding[0], extent[1] + padding[1] ]};
  });
};

DisplayFrame.prototype.domainIQR = function (variables) {
  return this.setDomain(variables, function (data, variable) {
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
  return this.setDomain(variables, function (data, variable) {
    var domain = bands || null;
    if (!domain) {
      domain = U.unique(U.map(d3.merge(data), U.pick(bandVariable)));
    }
    return { band: true, variable: bandVariable, domain: domain };
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
  var scale = display.axis(data, options.variable).scale;
  display.display.selectAll('svg').each(function() {
    var svg = d3.select(this);
    var axis = svg.select(DU.s(C_AXIS_X));
    if (axis.empty()) {
      axis = svg.append('g').attr('class', C_AXIS_X);
    }
    axis.attr('transform', DU.translateMargins(options, 0, display.size.inHeight))
      .call(d3.axisBottom(scale));
  });
}

function makeAxisLeft(display, data, options) {
  var scale = display.axis(data, options.variable).scale;
  display.display.selectAll('svg').each(function() {
    var svg = d3.select(this);
    var axis = svg.select(DU.s(C_AXIS_Y));
    if (axis.empty()) {
      axis = svg.append('g').attr('class', C_AXIS_Y);
    }
    axis.attr('transform', DU.translateMargins(options))
      .call(d3.axisLeft(scale));
  });
}

function makeLabels(display, data, options) {
  if (data.length == 0) return;
  var labels = display.display.select(DU.s(C_LABELS));
  if (labels.empty()) {
    labels = display.display.append('div').attr('class', C_LABELS);
  } else {
    labels.selectAll('span').remove();
  }
  for (var i = 0; i < options.labels.length; i++) {
    labels.append('span')
      .attr('class', 'label-dot d3stream-group-' + i);
    labels.append('span')
      .html(options.labels[i]);
  }
}
