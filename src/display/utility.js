var U = require('../utility.js');

module.exports = {

  translate: function (x, y) {
    return 'translate(' + x + ',' + y + ')';
  },

  translateMargins: function (options, x, y) {
    return this.translate(
      options.marginLeft + (x || 0),
      options.marginTop + (y || 0)
    );
  },

  textPadX: function (options, v) {
    return (v || 0) + options.textPadding;
  },

  textPadY: function (options, v) {
    return (v || 0) + (options.downwards ? -2 : 1) * options.textPadding;
  },

  a: function () {
    return U.argumentsArray(arguments).filter(U.isNonEmpty).join(' ');
  },

  s: function(cls) {
    return '.'.concat(String(cls));
  },

  transition: function (d3, options) {
    return d3.transition().duration(options.transitionDuration);
  },

  formatter: function (d3, options) {
    return d3.format(options.chartTextFormat);
  },

  groupSelector: function (options) {
    var groups = options.groups ? U.unstream(options.groups): {};
    return function (d) {
      return groups[d[options.groupVariable]];
    };
  },

  event: function (select, type) {
    return function (d, i) {
      select.event(type, select.d3.select(this), d, i);
    };
  },

  axis: function (display, data, options) {
    var axis = {
      x: display.axis(data, options.horizontalVariable),
      y: display.axis(data, options.verticalVariable),
      z: display.axis(data, options.scaleVariable),
    };
    axis.x.scale.rangeRound([0, display.size.inWidth]);
    axis.y.scale.rangeRound(options.downwards ? [0, display.size.inHeight] : [display.size.inHeight, 0]);
    axis.z.scale.rangeRound(options.dotRadiusRange);
    return axis;
  },

  stack: function (d3, dataSeries, axis, options) {
    var ybuf = {};
    var sdata = (options.reverseStack ? dataSeries.reverse() : dataSeries).map(function (serie) {
      return  serie.map(function (d) {
        var b = ybuf[d[axis.x.variable]] || 0;
        var n = b + d[axis.y.variable] || 0;
        var out = Object.assign({}, d, U.obj([axis.y.baseVariable, b], [axis.y.variable, n]));
        ybuf[d[axis.x.variable]] = n;
        return out;
      });
    });
    axis.y.domain = d3.extent(d3.merge(sdata).map(U.pick(axis.y.variable)).concat(0));
    axis.y.scale.domain(axis.y.domain);
    return sdata;
  },

  cutToDomain: function (data, parameter, domain) {
    var min = domain[0], max = domain[1];
    function obj(l) {
      var a = {};
      a[parameter] = l;
      return a;
    }
    return data.map(function (d) {
      var l = d[parameter];
      if (l > max) {
        return Object.assign({}, d, obj(max));
      } else if (l < min) {
        return Object.assign({}, d, obj(min));
      }
      return Object.assign({}, d);
    });
  },

  fill: function (d, axis, options, group) {
    return firstEvaluated(
      function () { return U.get(d, options.colorVariable); },
      function () { return U.get(group, options.colorVariable); },
      function () { return U.get(U.get(axis.config, U.get(d, axis.variable)), options.colorVariable); }
    );
  },

  text: function (value, formatter, height, options, group) {
    if (height > 2 * options.textPadding) {
      return this.a(formatter(value), U.get(group, options.labelVariable));
    }
    return '';
  }

};

function firstEvaluated() {
  for (var i = 0; i < arguments.length; i++) {
    var v = arguments[i]();
    if (v !== undefined) return v;
  }
  return undefined;
}
