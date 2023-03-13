module.exports = StreamBase;

function StreamBase(data, d3lib) {
  this.d3 = d3lib || d3;
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
  return this.transformations.reduce(function(data, t) { return t(data); }, this.data);
};

StreamBase.prototype.update = function () {
  // Override to support automatic stream dependencies.
};
