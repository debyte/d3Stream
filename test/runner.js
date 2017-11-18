var U = require('../src/utility.js');

var tests = U.assign(
  require('./base.js'),
  require('./transform.js'),
  require('./stream.js')
);

var keys = U.keys(tests);
for (var i = 0; i < keys.length; i++) {
  QUnit.test(keys[i], tests[keys[i]]);
}
