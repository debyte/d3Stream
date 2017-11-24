if (typeof define == 'function' && define.amd) {
  define([], function () {
    return require('./Stream.js');
  });
} else {
  window.d3Stream = require('./Stream.js');
}
