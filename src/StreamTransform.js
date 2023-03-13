module.exports = StreamTransform;

var U = require('./utility.js');
var C = require('./calculation.js');
var StreamBase = require('./StreamBase.js');

function StreamTransform(data, d3lib) {
  StreamBase.call(this, data, d3lib);
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
    return U.asList(data).map(callback);
  });
};

StreamTransform.prototype.mapAsStreams = function (callback) {
  return this.addTransformation(function (data) {
    return U.asList(data).map(function (d, i) {
      return U.unstream(callback(new StreamTransform(d), i));
    });
  });
};

StreamTransform.prototype.mapSubArrays = function (key, callback) {
  return this.addTransformation(function (data) {
    return U.asList(data).map(function (d1, i1) {
      return U.asList(d1[key]).map(function (d2, i2) {
          return callback(d1, d2, i1, i2);
      });
    });
  });
};

StreamTransform.prototype.filter = function (callback) {
  return this.addTransformation(function (data) {
    return U.asList(data).filter(callback);
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

StreamTransform.prototype.merge = function () {
  return this.addTransformation(function (data) {
    return this.d3.merge(data);
  });
};

StreamTransform.prototype.frequencies = function (groupkey, countkey) {
  return this.addTransformation(function (data) {
    return C.frequencies(data, groupkey, countkey);
  });
};

StreamTransform.prototype.periodically = function (period, accessor, timekey) {
  return this.addTransformation(function (data) {
    return C.periodically(data, period, accessor, timekey || 't', this.d3);
  });
}
