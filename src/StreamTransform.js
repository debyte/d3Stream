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

StreamTransform.prototype.frequencies = function (groupkey, countkey) {
  return this.addTransformation(function (data) {
    return U.frequencies(data, groupkey, countkey);
  });
}

StreamTransform.prototype.group = function (conditions) {
  return this.addTransformation(function (data) {
    return U.group(data, U.unstream(conditions));
  });
};

StreamTransform.prototype.cumulate = function (parameters) {
  return this.addTransformation(function (data) {
    return U.cumulate(data, U.unstream(parameters));
  });
};

StreamTransform.prototype.mapAsStreams = function (callback) {
  return this.addTransformation(function (data) {
    return U.map(data, function (d, i) {
      return U.unstream(callback(new StreamTransform(d), i));
    });
  });
};

StreamTransform.prototype.mapToObject = function (callback) {
  return this.addTransformation(function (data) {
    return U.reduce(data, function (out, d, i) {
      var e = callback(d, i);
      out[e[0]] = e[1];
      return out;
    }, {});
  });
};

StreamTransform.prototype.keys = function () {
  return this.addTransformation(function (data) {
    return data.length > 0 ? U.keys(data[0]) : [];
  });
};
