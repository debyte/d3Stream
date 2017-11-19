module.exports = StreamTransform;

var U = require('./utility.js');
var StreamBase = require('./StreamBase.js');

function StreamTransform(data) {
  StreamBase.call(this, data);
}

StreamTransform.prototype = Object.create(StreamBase.prototype);
StreamTransform.prototype.constructor = StreamTransform;

StreamTransform.prototype.consoleLog = function () {
  return this.addTransformation(function (data) {
    U.consoleLog(data);
    return data;
  });
};

StreamTransform.prototype.map = function (callback) {
  return this.addTransformation(function (data) {
    return U.map(data, callback);
  });
};

StreamTransform.prototype.filter = function (callback) {
  return this.addTransformation(function (data) {
    return U.filter(data, callback);
  });
};

StreamTransform.prototype.navigate = function (dotPath) {
  return this.addTransformation(function (data) {
    return U.navigate(data[0], dotPath);
  });
};

StreamTransform.prototype.cross = function (other) {
  return this.addTransformation(function (data) {
    return U.cross(data, optionalStream(other));
  });
};

StreamTransform.prototype.repeat = function (other) {
  return this.addTransformation(function (data) {
    return U.repeat(data, optionalStream(other));
  });
};

StreamTransform.prototype.group = function (conditions) {
  return this.addTransformation(function (data) {
    return U.group(data, optionalStream(conditions));
  });
};

StreamTransform.prototype.cumulate = function (parameters) {
  return this.addTransformation(function (data) {
    return U.cumulate(data, optionalStream(parameters));
  });
};

StreamTransform.prototype.mapAsStreams = function (callback) {
  return this.addTransformation(function (data) {
    return U.map(data, function (d, i) {
      var s = callback(new StreamTransform(d), i);
      return typeof s.array == 'function' ? s.array() : s;
    });
  });
};

StreamTransform.prototype.keys = function () {
  return this.addTransformation(function (data) {
    return data.length > 0 ? U.keys(data[0]) : [];
  });
};

function optionalStream(input) {
  if (typeof input.array == 'function') {
    return input.array();
  }
  return input;
}
