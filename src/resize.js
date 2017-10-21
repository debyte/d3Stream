module.exports = function(config) {
  'use strict';

  return resize;

  function resize(callback) {
    var resizeTimeout;

    $(window).on('resize', delayResize);

    function delayResize() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(doResize, config.resizeDelay);
      }
    }

    function doResize() {
      resizeTimeout = null;
      callback();
    }
  }
};
