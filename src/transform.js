var U = require('./utility.js');

module.exports = {

  _apply: function (data, transform) {
    if (!transform) return data;
    return U.reduce(
      [].concat(transform),
      function(data, t) { return t(data); },
      data
    );
  },

  consoleLog: function (data) {
    U.consoleLog(data);
    return data;
  },

  mapIndexedValues: function (data) {
    return U.map(data, function (d, i) {
      return {
        x: i,
        y: d,
        z: 0,
        payload: d,
      };
    });
  },

  mapPairedValues: function (data) {
    return U.map(data, function (d, i) {
      return {
        x: d[0],
        y: d[1],
        z: 0,
        payload: d,
      };
    });
  },

  map: function (callback) {
    return function (data) {
      return U.map(data, callback);
    };
  },

  filter: function (callback) {
    return function (data) {
      return U.filter(data, callback);
    };
  },

  prepend: function (newData) {
    return function(data) {
      return newData.concat(data);
    };
  },

  append: function (newData) {
    return function(data) {
      return data.concat(newData);
    };
  },

  navigate: function (dotPath) {
    return function (data) {
      return U.navigate(data, dotPath);
    };
  },

  cross: function (other) {
    return function (data) {
      return U.cross(data, other);
    };
  },

  repeat: function (other, callback) {
    return function (data) {
      return U.repeat(data, other, callback);
    };
  },

  group: function (conditions) {
    return function (data) {
      return U.group(data, conditions);
    };
  },

  cumulate: function(parameters) {
    return function (data) {
      return U.cumulate(data, parameters);
    };
  },

};
