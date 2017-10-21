module.exports = function (options) {
  'use strict';

  var defaults = {

    height: 200,
    maxBandWidth: 50,
    margin: {
      top: 10,
      left: 40,
      right: 30,
      bottom: 30,
    },

    bandPadding: 0.2,
    histogramBands: 25,
    ticksY: 4,
  };

  return $.extend(true, {}, defaults, options);
};
