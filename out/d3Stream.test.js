(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
module.exports = {

  "Empty stream": function (assert) {
    var s = new d3Stream();
    assert.deepEqual(s.array(), []);
  },

  "Plain stream": function (assert) {
    var s = new d3Stream(data);
    assert.deepEqual(s.array(), data);
    s = new d3Stream("test");
    assert.deepEqual(s.array(), ["test"]);
  },

  "Map stream": function (assert) {
    var s = new d3Stream(data).map(mapCtoX);
    assert.deepEqual(s.array(), data.map(mapCtoX));
  },

  "Map stream twice": function (assert) {
    var s = new d3Stream(data).map(mapCtoX).map(mapXtoC);
    assert.deepEqual(s.array(), data);
  },

  "Reset stream": function (assert) {
    var s = new d3Stream(data).map(mapCtoX);
    assert.deepEqual(s.array(), data.map(mapCtoX));
    s.reset();
    assert.deepEqual(s.array(), data);
  },

};

var data = [
  { a:1, b:2, c:3 },
  { a:4, b:5, c:6 },
  { a:7, b:8, c:9 },
];

function mapCtoX(d) {
  return { a: d.a, b: d.b, x: d.c };
}

function mapXtoC(d) {
  return { a: d.a, b:d.b, c: d.x };
}

},{}],3:[function(require,module,exports){
var U = require('../src/utility.js');

var tests = U.assign(
  require('./base.js'),
  require('./transform.js'),
  require('./stream.js')
);

var keys = U.keys(tests);
for (var i = 0; i < keys.length; i++) {
  QUnit.test(keys[i], tests[keys[i]]);
}

},{"../src/utility.js":1,"./base.js":2,"./stream.js":4,"./transform.js":5}],4:[function(require,module,exports){
module.exports = {

  "Stream load": function (assert) {
    var done = assert.async();
    createStreamWithDisplay(function (data) {
      assert.equal(data.length, 6);
      done();
    }).load("test.csv", { format: "csv" });
  },

  "Stream load and transform": function (assert) {
    var done = assert.async();
    createStreamWithDisplay(function (data) {
      if (data.length > 0) {
        assert.deepEqual(data, [1, 1, 1]);
        done();
      }
    }).load("test.csv", { format: "csv" })
    .filter(function (d, i) {
      return +d.a == 1 || +d.b == 1 || +d.c == 1;
    }).map(function (d, i) {
      return (+d.a) + (+d.b) + (+d.c) + (+d.e) + (+d.e) + (+d.f);
    });
  }

};

function createStreamWithDisplay(displayCallback) {
  var s = new d3Stream();
  var d = s.display();
  d.update = displayCallback;
  return s;
}

},{}],5:[function(require,module,exports){
module.exports = {

  "Map transform": function (assert) {
    var a = new d3Stream(data).map(function (d, i) {
      return [i, d.two];
    }).array();
    assert.equal(a.length, 100);
    assert.deepEqual(a[0], [0, 2]);
    assert.deepEqual(a[99], [99, 2]);
  },

  "Filter transform": function (assert) {
    var a = new d3Stream(data).filter(function (d, i) {
      return i < 10 || d.one >= 80;
    }).array();
    assert.equal(a.length, 30);
    assert.deepEqual(a[0], { one: 0, two: 2});
    assert.deepEqual(a[29], { one: 99, two: 2 });
  },

  "Navigate transform": function (assert) {
    var a = new d3Stream(
      { data: { first: [1, 2, 3], second: [] }}
    ).navigate('data.first').array();
    assert.deepEqual(a, [1, 2, 3]);
  },

  "Cross transform": function (assert) {
    var a = new d3Stream(data).cross(['a', 'b']).array();
    assert.equal(a.length, 100);
    assert.deepEqual(a[0], [[{ one: 0, two: 2}, 'a'], [{ one: 0, two: 2}, 'b']]);
    assert.deepEqual(a[99], [[{ one: 99, two: 2}, 'a'], [{ one: 99, two: 2}, 'b']]);
  },

  "Repeat transform": function (assert) {
    var a = new d3Stream(data).repeat(['a', 'b']).array();
    assert.equal(a.length, 2);
    assert.deepEqual(a[0][0], data);
    assert.equal(a[0][1], 'a');
    assert.deepEqual(a[1][0], data);
    assert.equal(a[1][1], 'b');
  },

  "Group transform": function (assert) {
    var a = new d3Stream(data).group([
      function (d) { return d.one < 10; },
      function (d) { return d.one < 50; },
      function (d) { return d.two == 2; },
    ]).array();
    assert.equal(a[0].length, 10);
    assert.equal(a[1].length, 40);
    assert.equal(a[2].length, 50);
    assert.deepEqual(a[0][0], { one: 0, two: 2 });
    assert.deepEqual(a[0][9], { one: 9, two: 2 });
    assert.deepEqual(a[1][0], { one: 10, two: 2 });
    assert.deepEqual(a[1][39], { one: 49, two: 2 });
    assert.deepEqual(a[2][0], { one: 50, two: 2 });
    assert.deepEqual(a[2][49], { one: 99, two: 2 });
  },

  "Cumulate transform": function (assert) {
    var a = new d3Stream(data).cumulate('one').array();
    assert.equal(a.length, 100);
    var sum = 0;
    for (var i = 0; i < 100; i++) {
      sum += i;
      assert.equal(a[i].one, sum);
    }
  },

  "MapAsStreams transform": function (assert) {
    var a = new d3Stream([[1, 2, 3], [3, 2, 1]]).mapAsStreams(function (s, i) {
      return s
        .map(function (d) { return d + 1; })
        .filter(function (d, i) { return i < 2; });
    }).array();
    assert.deepEqual(a, [[2, 3], [4, 3]]);
  },
};

var data = [];
for (var i = 0; i < 100; i++) {
  data.push({ one: i, two: 2 });
}

},{}]},{},[3]);
