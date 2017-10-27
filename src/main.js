var U = require('./utility.js');
var transform = require('./transform.js');
var display = require('./display/main.js');
var selector = require('./display/selector.js');
var loader = require('./load.js');
var resize = require('./resize.js');
var defaults = require('./config.js');

/* Blatantly write over global deSummary. */
window.deSummary = U.assign(
  transform,
  display,
  {
    load: load,
    u: U,
  }
);

function load(options) {

  var model = {};
  var displays = [];
  var select = selector(options);

  var ret = {
    model: model,
    select: select,
    update: update,
    load: loadMore,
    add: add,
    addMany: addMany,
    build: build,
    clear: clear,
  };

  loader(options, update);
  resize(update);
  return ret;

  function loadMore(options2) {
    loader(options2, update);
  }

  function update(data, key, append) {
    if (data) {
      key = key || 'data';
      model[key] = append ? (model[key] || []).concat(data) : data;
      select.clear();
    }
    for (var i = 0; i < displays.length; i++) {
      displays[i](model, i);
    }
    return ret;
  }

  function add(element, draw, options2) {
    var config = U.assign(defaults, inheritOptions(options), options2);
    displays.push(display._wrap(element, draw, select, config));
    update();
    return ret;
  }

  function addMany(element, draw, options2) {
    var config = U.assign(defaults, inheritOptions(options), options2);
    displays.push(display._wrapMany(element, draw, select, config));
    update();
    return ret;
  }

  function build(element, builder, options2) {
    displays.push(function (model, n, clear) {
      if (clear === undefined) builder(element, ret, options2);
    });
    update();
    return ret;
  }

  function clear() {
    for (var i = 0; i < displays.length; i++) {
      displays[i](model, i, true);
    }
    U.empty(displays);
    return ret;
  }

}

function inheritOptions(options) {
  return {
    domain: options.domain,
    scale: options.scale,
  };
}
