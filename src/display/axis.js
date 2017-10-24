var U = require('../utility.js');

module.exports = {

  domainManual: function(range) {
    return function (data, accessor, options) {
      return range;
    };
  },

  domainPad: function(pad) {
    return function (data, accessor, options) {
      var extent = d3.extent(data, accessor);
      return [extent[0] - pad, extent[1] + pad];
    };
  },

  domainExtent: function (data, accessor, options) {
    return d3.extent(data, accessor);
  },

  domainIQR: function (data, accessor, options) {
    var sorted = U.map(data, accessor).sort();
    var q1 = sorted[Math.floor(0.25 * sorted.length)];
    var q3 = sorted[Math.floor(0.75 * sorted.length)];
    var iqr = q3 - q1;
    return [
      Math.max(q1 - 1.5 * iqr, sorted[0]),
      Math.min(q3 + 1.5 * iqr, sorted[sorted.length - 1])
    ];
  },

  scaleLinear: function (range, domain, options) {
    return d3.scaleLinear()
      .range(range)
      .domain(domain)
      .nice();
  },

};
