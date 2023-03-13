(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
var tests = Object.assign(
  {},
  require('./base.js'),
  require('./transform.js'),
  require('./stream.js')
);

Object.keys(tests).forEach(function (k) {
  QUnit.test(k, tests[k]);
});

},{"./base.js":1,"./stream.js":3,"./transform.js":4}],3:[function(require,module,exports){
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
      return +d.a == 1 || +d.b == 1 || +d.c == 1;
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

},{}],4:[function(require,module,exports){
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
      return i < 10 || d.one >= 80;
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

},{}]},{},[2]);
