module.exports = function(callback) {
  var resizeTimeout;

  $(window).on('resize', delayResize);

  function delayResize() {
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(doResize, 500);
    }
  }

  function doResize() {
    resizeTimeout = null;
    callback();
  }

};
