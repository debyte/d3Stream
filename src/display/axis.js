var U = require('../utility.js');

module.exports = {

  _get: function (data, options, many) {
    return U.reduce(['x', 'y', 'z'], function (scales, a) {
      var f = optionPath(options, 'scale', a, scaleLinear);
      scales[a] = f(data, a, options, many);
      return scales;
    }, {});
  },

  scaleLinear: scaleLinear,
  scaleBand: scaleBand,
  domainManual: domainManual,
  domainExtent: domainExtent,
  domainPad: domainPad,
  domainIQR: domainIQR,
  domainBands: domainBands,
};

function optionPath(options, key1, key2, def) {
  if (!options[key1]) return def;
  if (typeof options[key1] == 'function') return options[key1];
  return options[key1][key2] || def;
}

function scaleLinear(data, a, options, many) {
  var d = getDomain(data, a, domainExtent, options, many);
  return {
    a: d.a || a,
    domain: d.domain,
    scale: d3.scaleLinear().domain(d.domain).nice(),
    pick: function (d, w) {
      if (w) return this.scale(d[this.a]) - w;
      return this.scale(d[this.a]);
    },
  };
}

function scaleBand(data, a, options, many) {
  var d = getDomain(data, a, domainBands, options, many);
  return {
    a: d.a || a,
    domain: d.domain,
    scale: d3.scaleBand().domain(d.domain).padding(options.bandPadding),
    pick: function (d, w) {
      if (w !== undefined) return this.scale(d[this.a]);
      return this.scale(d[this.a]) + this.scale.bandwidth() / 2;
    },
  };
}

function getDomain(data, a, def, options, many) {
  var f = optionPath(options, 'domain', a, def);
  return f(data, a, options, many);
}

function domainManual(range) {
  return function (data, a, options, many) {
    return { domain: range };
  };
}

function domainExtent(data, a, options, many) {
  if (many) data = d3.merge(data);
  return { domain: d3.extent(data, U.pick(a)) };
}

function domainPad(pad) {
  return function (data, a, options, many) {
    var extent = domainExtent(data, a, options, many).domain;
    return { domain: [extent[0] - pad[0], extent[1] + pad[1]] };
  };
}

function domainIQR(data, a, options, many) {
  if (many) data = d3.merge(data);
  var sorted = U.map(data, U.pick(a)).sort();
  var q1 = sorted[Math.floor(0.25 * sorted.length)];
  var q3 = sorted[Math.floor(0.75 * sorted.length)];
  var iqr = q3 - q1;
  return { domain: [
    Math.max(q1 - 1.5 * iqr, sorted[0]),
    Math.min(q3 + 1.5 * iqr, sorted[sorted.length - 1])
  ]};
}

function domainBands(data, a, options, many) {
  var domain = options.scale[a + 'Bands'] || null;
  if (!domain) {
    if (many) data = d3.merge(data);
    domain = U.unique(U.map(data, U.pick('band')));
  }
  return { a: 'band', domain: domain };
}
