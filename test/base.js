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
