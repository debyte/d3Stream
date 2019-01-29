module.exports = {
  map: map,
  filter: filter,
  reduce: reduce,
  isStream: isStream,
  isIn: isIn,
  containedIn: containedIn,
  removeFrom: removeFrom,
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

  empty: function (list) {
    list.splice(0, list.length);
  },

  unstream: function (any) {
    return isStream(any) ? any.unstream() : any;
  },

  pick: function (key) {
    return function (obj) {
      return obj !== undefined ? obj[key] : undefined;
    };
  },

  splitEach: function (list, sep) {
    return reduce(list || [], function (out, val) {
      return out.concat(val.split(sep));
    }, []);
  },

  countEach: function (vals) {
    return reduce(vals || [], function (out, val) {
      out[val] = (out[val] || 0) + 1;
      return out;
    }, {});
  },

  navigate: function (data, dotPath) {
    return reduce(dotPath.split('.'), function (out, k) {
      return out !== undefined ? out[k] : undefined;
    }, data);
  },

  repeat: function (data, other) {
    return map(other || [], function (z) {
      return [data, z];
    });
  },

  cross: function (data, other) {
    return map(data || [], function (d) {
      return map(other || [], function (z) {
        return [d, z];
      });
    });
  },

  unique: function (data) {
    return reduce(data || [], function(out, d) {
      if (!isIn(d, out)) out.push(d);
      return out;
    }, []);
  },

  frequencies: function (data, groupkey, countkey) {
    var counts = reduce(data || [], function(out, d) {
      var v = d[groupkey];
      if (v !== undefined) {
        out[v] = (out[v] || 0) + (countkey === undefined ? 1 : d[countkey] || 0);
      }
      return out;
    }, {});
    return reduce(keys(counts), function(out, v) {
      out.push({ 'value': v, 'count': counts[v] });
      return out;
    }, []);
  },

  group: function (data, conditions) {
    var groups = reduce(conditions || [], function (out) {
      out.push([]);
      return out;
    }, []);
    return reduce(data || [], function (out, d) {
      for (var i = 0; i < out.length; i++) {
        if (conditions[i](d)) {
          out[i].push(d);
          return out;
        }
      }
      return out;
    }, groups);
  },

  cumulate: function(data, parameters) {
    var keys = [].concat(parameters || []);
    return reduce(data || [], function (out, d) {
      if (out.length > 0) {
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          d[key] = out[out.length - 1][key] + (d[key] || 0);
        }
      }
      out.push(d);
      return out;
    }, []);
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
  var out = initial;
  for (var i = 0; i < data.length; i++) {
    out = callback(out, data[i], i, data);
  }
  return out;
}

function isStream(any) {
  return any !== undefined && typeof any.unstream == 'function';
}

function isIn(val, list) {
  return (list || []).indexOf(val) >= 0;
}

function removeFrom(val, list) {
  return list.splice(list.indexOf(val), 1);
}

function containedIn(items, list) {
  for (var i = 0; i < items.length; i++) {
    if (!isIn(items[i], list)) {
      return false;
    }
  }
  return true;
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
  return reduce(arguments, function (merged, arg) {
    for (var k in arg) {
      merged[k] = arg[k];
    }
    return merged;
  }, {});
}
