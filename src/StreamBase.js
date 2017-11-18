module.exports = StreamBase;

var U = require('./utility.js');

function StreamBase(data) {
  this.data = data !== undefined ? [].concat(data) : [];
  this.transformations = [];
}

StreamBase.prototype.addTransformation = function (transformFunction) {
  this.transformations.push(transformFunction);
  this.update();
  return this;
};

StreamBase.prototype.reset = function () {
  this.transformations = [];
  this.update();
  return this;
};

StreamBase.prototype.array = function () {
  if (!this.data || !this.transformations) return this.data;
  return U.reduce(
    this.transformations,
    function(data, t) { return t(data); },
    this.data
  );
};

StreamBase.prototype.update = function () {
  // Override to support automatic stream dependencies.
};
