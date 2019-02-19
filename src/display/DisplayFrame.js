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
  if (this.config.horizontalAxis) {
    this.addFrame(makeAxisHorizontal);
  }
  if (this.config.verticalAxis) {
    this.addFrame(makeAxisVertical);
  }
  if (this.config.groupLabels) {
    this.addFrame(makeLabels);
  }
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
  var self = this;
  U.asList(variables).forEach(function (v) {
    self.domainFunction[v] = domainFunction;
  });
  return this;
};

DisplayFrame.prototype.domainManual = function (variables, range) {
  var r = Array.isArray(range) ? range : [0, range];
  return this.setDomain(variables, function (d3, data, variable) {
    return { domain: r };
  });
};

DisplayFrame.prototype.domainZero = function (variables) {
  return this.setDomain(variables, function (d3, data, variable) {
    var d = domainExtent(d3, data, variable);
    if (d.missing) return d;
    return { domain: [
      Math.min(0, d.domain[0]),
      Math.max(0, d.domain[1])
    ]};
  });
};

DisplayFrame.prototype.domainPad = function (variables, padding) {
  var p = Array.isArray(padding) ? padding : [padding, padding];
  return this.setDomain(variables, function (d3, data, variable) {
    var d = domainExtent(d3, data, variable);
    if (d.missing) return d;
    return { domain: [
      d.domain[0] - p[0],
      d.domain[1] + p[1]
    ]};
  });
};

DisplayFrame.prototype.domainIQR = function (variables) {
  return this.setDomain(variables, function (d3, data, variable) {
    var sorted = d3.merge(data).map(U.pick(variable)).sort();
    if (sorted.length < 2 || sorted[0] === undefined) {
      return { domain: [0, 1], missing: true };
    }
    var q1 = sorted[Math.floor(0.25 * sorted.length)];
    var q3 = sorted[Math.floor(0.75 * sorted.length)];
    var iqr = q3 - q1;
    return { domain: [
      Math.max(q1 - 1.5 * iqr, sorted[0]),
      Math.min(q3 + 1.5 * iqr, sorted[sorted.length - 1])
    ]};
  });
};

DisplayFrame.prototype.domainBands = function (variables, bands) {
  var pad = this.config.bandPadding;
  return this.setDomain(variables, function (d3, data, variable) {
    var def = {};
    var vals = U.unstream(bands);
    if (vals instanceof Array) {
      if (vals.length > 0 && vals[0].key !== undefined) {
        def.domain = vals.map(function (d) { return d.key; });
        def.config = U.mapToObject(vals, function (d) { return [d.key, d]; });
      } else {
        def.domain = vals;
      }
    } else {
      def.domain = U.unique(d3.merge(data).map(U.pick(variable)));
      if (vals instanceof Object) {
        def.config = vals;
      }
    }
    def.scale = d3.scaleBand().domain(def.domain).padding(pad);
    return def;
  });
};

DisplayFrame.prototype.domainTime = function (variables) {
  return this.setDomain(variables, function (d3, data, variable) {
    var def = domainExtent(d3, data, variable);
    def.scale = d3.scaleTime().domain(def.domain);
    return def;
  });
};

function domainExtent(d3, data, variable) {
  var e = d3.extent(d3.merge(data), U.pick(variable));
  if (e.length < 2 || e.indexOf(undefined) >= 0) {
    return { domain: [0, 1], missing: true };
  }
  return { domain: e };
}

function makeAxisHorizontal(display, axis, data) {
  var ax = axis[display.config.horizontalVariable];
  display.display.selectAll('svg').each(function() {
    var d3ax = display.d3.axisBottom(ax.scale);
    var g = prepareAxis(display, this, C_AXIS_X, ax, d3ax);
    g.attr('transform', DU.translateMargins(display.config, 0, display.size.inHeight))
      .call(d3ax);
  });
}

function makeAxisVertical(display, axis, data) {
  var ax = axis[display.config.verticalVariable];
  display.display.selectAll('svg').each(function() {
    var d3ax = display.d3.axisLeft(ax.scale);
    var g = prepareAxis(display, this, C_AXIS_Y, ax, d3ax);
    g.attr('transform', DU.translateMargins(display.config))
      .call(d3ax);
  });
}

function prepareAxis(display, svg, cls, axis, d3axis) {
  var svg = display.d3.select(svg);
  var g = svg.select(DU.s(cls));
  if (!g.empty()) {
    g.remove();
  }
  g = svg.append('g').attr('class', cls);
  if (axis.config) {
    d3axis.tickFormat(function (x) {
      return U.get(U.get(axis.config, x), display.config.labelVariable) || x;
    });
  }
  return g;
}

function makeLabels(display, axis, data) {
  if (data.length > 0) {
    var div = display.display.select(DU.s(C_LABELS));
    if (div.empty()) {
      div = display.display.append('div').attr('class', C_LABELS);
    } else {
      div.selectAll('span').remove();
    }
    Object.values(U.unstream(display.config.groups)).forEach(function (g) {
      div.append('span')
        .attr('class', display.config.labelClasses)
        .html(g[display.config.labelVariable])
        .style('background-color', g[display.config.colorVariable]);
    });
  }
}
