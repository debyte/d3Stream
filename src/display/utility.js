var U = require('../utility.js');
var axis = require('./axis.js');

module.exports = {
  translate: translate,

  translateMargins: function (options, x, y) {
    return translate(
      options.marginLeft + (x || 0),
      options.marginTop + (y || 0)
    );
  },

  s: function(cls) {
    return '.'.concat(String(cls));
  },

  a: function() {
    return U.filter(arguments, U.isNonEmpty).join(' ');
  },

  transition: function (options) {
    return d3.transition().duration(options.transitionDuration);
  },

  cutToDomain: function (data, parameter, domain) {
    var min = domain[0], max = domain[1];
    function obj(l) {
      var a = {};
      a[parameter] = l;
      return a;
    }
    return U.map(data, function (d) {
      var l = d[parameter];
      if (l > max) {
        return U.assign(d, obj(max));
      } else if (l < min) {
        return U.assign(d, obj(min));
      }
      return U.assign(d);
    });
  },

};

function translate(x, y) {
  return 'translate(' + x + ',' + y + ')';
}
