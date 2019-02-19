var U = require('./utility.js');

module.exports = {

  frequencies: function (data, groupkey, countkey) {
    var gks = U.asList(groupkey);
    if (gks.length == 0) return [];

    var fdata = U.asList(data).map(function (d) {
      return {
          'keys': gks.map(function (k) { return d[k]; }),
          'count': countkey === undefined ? 1 : d[countkey] || 0
      };
    }).filter(function (d) {
      return !d.keys.includes(undefined);
    });

    var kdata = gks.map(function (k) { return []; });
    fdata.forEach(function (d) {
      d.keys.forEach(function (k, i) {
        if (!kdata[i].includes(k)) {
          kdata[i].push(k);
        }
      });
    });

    var map = {};
    function mapRecursion(map, kdata) {
      kdata[0].forEach(function (k) {
        if (kdata.length > 1) {
          map[k] = {};
          mapRecursion(map[k], kdata.slice(1));
        } else {
          map[k] = 0;
        }
      });
    }
    mapRecursion(map, kdata);

    function countRecursion(map, vks, count) {
      if (vks.length > 1) {
        countRecursion(map[vks[0]], vks.slice(1), count);
      } else {
        map[vks[0]] += count;
      }
    }
    fdata.forEach(function (d) {
      countRecursion(map, d.keys, d.count);
    });

    function arrayRecursion(map) {
      return Object.keys(map).map(function (k) {
        if (typeof map[k] == 'object') {
          return { 'value': k, 'map': arrayRecursion(map[k]) };
        }
        return { 'value': k, 'count': map[k] };
      });
    }
    return arrayRecursion(map);
  },

  periodically: function (data, interval, accessor, timekey) {
    return U.asList(data).reduce(function (out, d) {
      var val = accessor(d);
      (Array.isArray(val) ?
        interval.range(interval.floor(val[0]), val[1]) :
        [interval.floor(val)]
      ).forEach(function (t) {
        out.push(Object.assign({}, d, U.obj([timekey, t.getTime()])));
      });
      return out;
    }, []);
  },

};
