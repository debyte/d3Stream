module.exports = {

  toNumber: function (val) {
    return parseFloat(val);
  },

  isNotNaN: function (val) {
    return !isNaN(val);
  },

  isNonEmpty: function (val) {
    return val && (val.trim === undefined || val.trim() !== '');
  },

  isIn: function (value, list) {
    return list.indexOf(value) >= 0;
  },

  pick: function (key) {
    return function (obj) {
      return obj[key];
    };
  },

  values: function (obj) {
    var vals = [];
    for (var key in obj) {
      vals.push(obj[key]);
    }
    return vals;
  },

  splitEach: function (list, sep) {
    var vals = [];
    for (var i = 0; i < list.length; i++) {
      vals = vals.concat(list[i].split(sep));
    }
    return vals;
  },

  countEach: function (vals) {
    var counts = {};
    for (var i = 0; i < vals.length; i++) {
      counts[vals[i]] = (counts[vals[i]] || 0) + 1;
    }
    return counts;
  },

};
