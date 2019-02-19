module.exports = {

  isStream: function (any) {
    return any !== undefined && typeof any.unstream == 'function';
  },

  unstream: function (any) {
    return this.isStream(any) ? any.unstream() : any;
  },

  consoleLog: function (d) {
    console.log(d);
  },

  argumentsArray: function (args) {
    return Array.prototype.slice.call(args);
  },

  get: function (obj, key) {
    return obj !== undefined ? obj[key] : undefined;
  },

  obj: function () {
    return this.objl(this.argumentsArray(arguments));
  },

  objl: function (items) {
    return this.asList(items).reduce(function (out, e) {
      out[e[0]] = e[1];
      return out;
    }, {});
  },

  isNotNaN: function (val) {
    return !isNaN(val);
  },

  isNonEmpty: function (val) {
    return val && (val.trim === undefined || val.trim() !== '');
  },

  remove: function (list, val) {
    return list.splice(list.indexOf(val), 1);
  },

  clear: function (list) {
    list.splice(0, list.length);
  },

  pick: function (key) {
    return function (obj) {
      return obj !== undefined ? obj[key] : undefined;
    };
  },

  asList: function (obj) {
    return [].concat(obj !== undefined ? obj : []);
  },

  splitEach: function (list, sep) {
    return this.asList(list).reduce(function (out, val) {
      return out.concat(val.split(sep));
    }, []);
  },

  mapToObject: function (list, callback) {
    return this.objl(this.asList(list).map(callback));
  },

  countEach: function (vals) {
    return this.asList(vals).reduce(function (out, val) {
      out[val] = (out[val] || 0) + 1;
      return out;
    }, {});
  },

  navigate: function (data, dotPath) {
    return dotPath.split('.').reduce(function (out, k) {
      return out !== undefined ? out[k] : undefined;
    }, data);
  },

  unique: function (data) {
    return this.asList(data).reduce(function (out, d) {
      if (!out.includes(d)) out.push(d);
      return out;
    }, []);
  },

  repeat: function (data, other) {
    return this.asList(data).map(function (z) {
      return [data, z];
    });
  },

  cross: function (data, other) {
    return this.asList(data).map(function (d) {
      return this.asList(other).map(function (z) {
        return [d, z];
      });
    });
  },

  group: function (data, conditions) {
    var groups = this.asList(conditions).map(function (c) { return []; });
    this.asList(data).forEach(function (d) {
      for (var i = 0; i < groups.length; i++) {
        if (conditions[i](d)) {
          groups[i].push(d);
          return;
        }
      }
    });
    return groups;
  },

  cumulate: function(data, parameters) {
    var keys = this.asList(parameters);
    return this.asList(data).reduce(function (out, d) {
      if (out.length > 0) {
        keys.forEach(function (k) {
          d[k] = out[out.length - 1][k] + (d[k] || 0);
        });
      }
      out.push(d);
      return out;
    }, []);
  },

};

/* Good enough polyfills */

if (!Array.prototype.map) {
  Array.prototype.map = function (callback) {
    var out = [];
    for (var i = 0; i < this.length; i++) {
      out.push(callback(this[i], i, this));
    }
    return out;
  };
}

if (!Array.prototype.filter) {
  Array.prototype.filter = function (callback) {
    var out = [];
    for (var i = 0; i < this.length; i++) {
      if (callback(this[i], i, this)) {
        out.push(this[i]);
      }
    }
    return out;
  };
}

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function (callback, initial) {
    var out = initial;
    for (var i = 0; i < this.length; i++) {
      out = callback(out, this[i], i, this);
    }
    return out;
  };
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (callback) {
    for (var i = 0; i < this.length; i++) {
      callback(this[i], i, this);
    }
  };
}

if (!Array.prototype.includes) {
  Array.prototype.includes = function (val) {
    return this.indexOf(val) >= 0;
  };
}

if (!Object.keys) {
  Object.keys = function (obj) {
    var keys = [];
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) keys.push(key);
    }
    return keys;
  };
}

if (!Object.values) {
  Object.values = function (obj) {
    return Object.keys(obj).map(function (k) { return obj[k]; });
  };
}

if (!Object.assign) {
  Object.assign = function () {
    merged = arguments.length > 0 ? arguments[0] : undefined;
    for (var i = 1; i < arguments.length; i++) {
      var a = arguments[i];
      Object.keys(a || {}).forEach(function (k) {
        merged[k] = a[k];
      });
    }
    return merged;
  };
}
