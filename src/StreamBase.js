module.exports = StreamBase;

var U = require('./utility.js');

function StreamBase(data) {
  this.data = data;
  this.transformations = [];
}

StreamBase.prototype.addTransformation = function (transformFunction) {
  this.transformations.push(transformFunction);
  return this;
};

StreamBase.prototype.reset = function () {
  this.transformations = [];
  return this;
};

StreamBase.prototype.unstream = function () {
  if (this.data === undefined || !this.transformations) return this.data;
  return U.reduce(
    this.transformations,
    function(data, t) { return t(data); },
    this.data
  );
};

StreamBase.prototype.update = function () {
  // Override to support automatic stream dependencies.
};
