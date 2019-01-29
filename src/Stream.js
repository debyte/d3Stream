module.exports = Stream;

var U = require('./utility.js');
var StreamTransform = require('./StreamTransform.js');
var Display = require('./display/Display.js');

function Stream(data) {
  StreamTransform.call(this, data);
  this.displays = [];
}

Stream.prototype = Object.create(StreamTransform.prototype);
Stream.prototype.constructor = Stream;

Stream.prototype.load = function(url, options, d3lib) {
  var self = this;
  var opt = options || {};
  var d3r = d3lib || d3;
  loadAsPromise(url).then(function(data) {
    self.update(data, opt);
  });
  return this;

  function loadAsPromise(url) {
    if (opt.format == 'csv') {
      return d3r.csv(url);
    } else if (opt.format == 'tsv') {
      return d3r.tsv(url);
    } else if (opt.format == 'xml') {
      return d3r.xml(url);
    }
    return d3r.json(url);
  }
};

Stream.prototype.branch = function() {
  var b = new Stream(this.unstream());
  this.displays.push(b);
  return b;
};

Stream.prototype.display = function(element, options, d3lib) {
  var d = new Display(d3lib || d3, element, options, this.unstream());
  this.displays.push(d);
  return d;
};

Stream.prototype.update = function(data, options) {
  var opt = options || {};
  if (data !== undefined) {
    if (opt.append) {
      this.data = this.data.concat(data);
    } else if (opt.prepend) {
      this.data = data.concat(this.data);
    } else {
      this.data = data;
    }
  }
  var transformedData = this.unstream();
  if (this.displays.length > 0) {
    for (var i = 0; i < this.displays.length; i++) {
      this.displays[i].update(transformedData);
    }
  }
  return this;
};

Stream.prototype.contains = function (item) {
  return U.isIn(item, this.data);
};

Stream.prototype.containedIn = function (list) {
  return U.containedIn(this.data, list);
};

Stream.prototype.remove = function (item) {
  U.removeFrom(item, this.data);
  this.update();
  return this;
};

Stream.prototype.empty = function (item) {
  this.data = [];
  this.update();
  return this;
};

Stream.prototype.add = function (item) {
  return this.update(item, { append: true });
};
