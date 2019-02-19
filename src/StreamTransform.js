module.exports = StreamTransform;

var U = require('./utility.js');
var C = require('./calculation.js');
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
    return data.map(callback);
  });
};

StreamTransform.prototype.mapAsStreams = function (callback) {
  return this.addTransformation(function (data) {
    return data.map(function (d, i) {
      return U.unstream(callback(new StreamTransform(d), i));
    });
  });
};

StreamTransform.prototype.filter = function (callback) {
  return this.addTransformation(function (data) {
    return data.filter(callback);
  });
};

StreamTransform.prototype.keys = function () {
  return this.addTransformation(function (data) {
    return data.length > 0 ? Object.keys(data[0]) : [];
  });
};

StreamTransform.prototype.mapToObject = function (callback) {
  return this.addTransformation(function (data) {
    return U.mapToObject(data, callback);
  });
};

StreamTransform.prototype.navigate = function (dotPath) {
  return this.addTransformation(function (data) {
    return U.navigate(data, dotPath);
  });
};

StreamTransform.prototype.cross = function (other) {
  return this.addTransformation(function (data) {
    return U.cross(data, U.unstream(other));
  });
};

StreamTransform.prototype.repeat = function (other) {
  return this.addTransformation(function (data) {
    return U.repeat(data, U.unstream(other));
  });
};

StreamTransform.prototype.group = function (conditions) {
  return this.addTransformation(function (data) {
    return U.group(data, U.unstream(conditions));
  });
};

StreamTransform.prototype.unique = function () {
  return this.addTransformation(function (data) {
    return U.unique(data);
  });
}

StreamTransform.prototype.cumulate = function (parameters) {
  return this.addTransformation(function (data) {
    return U.cumulate(data, U.unstream(parameters));
  });
};

StreamTransform.prototype.frequencies = function (groupkey, countkey) {
  return this.addTransformation(function (data) {
    return C.frequencies(data, groupkey, countkey);
  });
};
