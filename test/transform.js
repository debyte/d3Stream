module.exports = {

  "Map transform": function (assert) {
    var a = new d3Stream(data).map(function (d, i) {
      return [i, d.two];
    }).unstream();
    assert.equal(a.length, 100);
    assert.deepEqual(a[0], [0, 2]);
    assert.deepEqual(a[99], [99, 2]);
  },

  "Filter transform": function (assert) {
    var a = new d3Stream(data).filter(function (d, i) {
      return i < 10 || d.one >= 80;
    }).unstream();
    assert.equal(a.length, 30);
    assert.deepEqual(a[0], { one: 0, two: 2});
    assert.deepEqual(a[29], { one: 99, two: 2 });
  },

  "Navigate transform": function (assert) {
    var a = new d3Stream(
      { data: { first: [1, 2, 3], second: [] }}
    ).navigate('data.first').unstream();
    assert.deepEqual(a, [1, 2, 3]);
  },

  "Cross transform": function (assert) {
    var a = new d3Stream(data).cross(['a', 'b']).unstream();
    assert.equal(a.length, 100);
    assert.deepEqual(a[0], [[{ one: 0, two: 2}, 'a'], [{ one: 0, two: 2}, 'b']]);
    assert.deepEqual(a[99], [[{ one: 99, two: 2}, 'a'], [{ one: 99, two: 2}, 'b']]);
  },

  "Repeat transform": function (assert) {
    var a = new d3Stream(data).repeat(['a', 'b']).unstream();
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
    ]).unstream();
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
    var a = new d3Stream(data).cumulate('one').unstream();
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
    }).unstream();
    assert.deepEqual(a, [[2, 3], [4, 3]]);
  },
};

var data = [];
for (var i = 0; i < 100; i++) {
  data.push({ one: i, two: 2 });
}
