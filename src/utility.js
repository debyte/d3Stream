module.exports = {
  map: map,
  filter: filter,
  reduce: reduce,
  keys: keys,
  values: values,
  assign: assign,

  consoleLog: function (d) {
    console.log(d);
  },

  toNumber: function (val) {
    return parseFloat(val);
  },

  isNotNaN: function (val) {
    return !isNaN(val);
  },

  isNonEmpty: function (val) {
    return val && (val.trim === undefined || val.trim() !== '');
  },

  isIn: function (val, list) {
    return list.indexOf(val) >= 0;
  },

  removeFrom: function (val, list) {
    return list.splice(list.indexOf(val), 1);
  },

  empty: function (list) {
    list.splice(0, list.length);
  },

  pick: function (key) {
    return function (obj) {
      return obj[key];
    };
  },

  splitEach: function (list, sep) {
    return reduce(
      list,
      function (vals, val) {
        vals = vals.concat(val.split(sep));
        return vals;
      },
      []
    );
  },

  countEach: function (vals) {
    return reduce(
      vals,
      function (counts, val) {
        counts[val] = (counts[val] || 0) + 1;
        return counts;
      },
      {}
    );
  },

  navigate: function (data, dotPath) {
    return [].concat(reduce(
      dotPath.split('.'),
      function (data, k) { return data[k]; },
      data
    ));
  },

  cross: function (data, other) {
    return map(data, function (d) {
      return map(other, function (z) {
        return [d, z];
      });
    });
  },

  repeat: function (data, other, callback) {
    return map(other, function (z) {
      return callback(data, z);
    });
  },

  group: function (data, conditions) {
    var groups = reduce(
      conditions,
      function (groups, i) {
        groups.push([]);
        return groups;
      },
      []
    );
    return reduce(
      data,
      function (groups, d) {
        for (var i = 0; i < conditions.length; i++) {
          if (conditions[i](d)) {
            groups[i].push(d);
            return groups;
          }
        }
        return groups;
      },
      groups
    );
  },

  cumulate: function(data, parameters) {
    var keys = [].concat(parameters);
    return reduce(
      data,
      function (out, d) {
        if (out.length > 0) {
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            d[key] = out[out.length - 1][key] + (d[key] || 0);
          }
        }
        out.push(d);
        return out;
      },
      []
    );
  },

};

function map(data, callback) {
  if (typeof data.map == 'function') return data.map(callback);
  var out = [];
  for (var i = 0; i < data.length; i++) {
    out.push(callback(data[i], i, data));
  }
  return out;
}

function filter(data, callback) {
  if (typeof data.filter == 'function') return data.filter(callback);
  var out = [];
  for (var i = 0; i < data.length; i++) {
    if (callback(data[i], i, data)) {
      out.push(data[i]);
    }
  }
  return out;
}

function reduce(data, callback, initial) {
  if (typeof data.reduce == 'function') return data.reduce(callback, initial);
  var accumulator = initial;
  for (var i = 0; i < data.length; i++) {
    accumulator = callback(accumulator, data[i], i, data);
  }
  return accumulator;
}

function keys(obj) {
  if (typeof Object.keys == 'function') return Object.keys(obj);
  var keys = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) keys.push(key);
  }
  return keys;
}

function values(obj) {
  if (typeof Object.values == 'function') return Object.values(obj);
  var vals = [];
  for (var key in keys(obj)) {
    vals.push(obj[key]);
  }
  return vals;
}

function assign() {
  return reduce(
    arguments,
    function (merged, arg) {
      for (var k in arg) {
        merged[k] = arg[k];
      }
      return merged;
    },
    {}
  );
}
