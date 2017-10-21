module.exports = function (model, callback) {
  'use strict';

  if (model.url) {
    if (model.format == 'csv') {
      d3.csv(model.url, onLoad);
    } else {
      d3.json(model.url, onLoad);
    }
  } else {
    onLoad(undefined, model.data || []);
  }

  function onLoad(error, data) {
    if (error) {
      return callback(error);
    }
    if (model.navigate) {
      var parts = model.navigate.split('.');
      for (var i = 0; i < parts.length; i++) {
        if (data[parts[i]] === undefined) {
          return callback('Failed to navigate data: ' + parts[i]);
        }
        data = data[parts[i]];
      }
    }
    model.data = [].concat(data);
    onArray();
  }

  function onArray() {
    if (model.prepend) {
      model.data = model.prepend.concat(model.data);
    }
    if (model.append) {
      model.data = model.data.concat(model.append);
    }
    callback();
  }
};
