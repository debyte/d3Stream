var tests = Object.assign(
  {},
  require('./base.js'),
  require('./transform.js'),
  require('./stream.js')
);

Object.keys(tests).forEach(function (k) {
  QUnit.test(k, tests[k]);
});
