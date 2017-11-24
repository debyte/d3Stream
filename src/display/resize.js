module.exports = function(d3, callback) {
  var resizeTimeout;

  d3.select(window).on('resize', delayResize);

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
