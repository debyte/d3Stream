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

Stream.prototype.load = function(url, options) {
  var self = this;
  var opt = options || {};
  if (opt.format == 'csv') {
    d3.csv(url, onLoad);
  } else if (opt.format == 'tsv') {
    d3.tsv(url, onLoad);
  } else if (opt.format == 'xml') {
    d3.xml(url, onLoad);
  } else {
    d3.json(url, onLoad);
  }
  return this;

  function onLoad(error, data) {
    if (error) throw error;
    self.update([].concat(data), options);
  }
};

Stream.prototype.display = function(element, options) {
  var d = new Display(element, options, this.data);
  this.displays.push(d);
  return d;
};

Stream.prototype.update = function(data, options) {
  var opt = options || {};
  if (data) {
    if (opt.append) {
      this.data = this.data.concat(data);
    } else if (opt.prepend) {
      this.data = data.concat(this.data);
    } else {
      this.data = data;
    }
  }
  if (this.displays.length > 0) {
    var transformedData = this.array();
    for (var i = 0; i < this.displays.length; i++) {
      this.displays[i].update(transformedData);
    }
  }
  return this;
};
