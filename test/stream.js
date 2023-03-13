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
