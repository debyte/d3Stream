/* function buildFields

module.exports = function (model, width, height) {
  'use strict';
  var utility = require('./utility.js');
  var draw = require('./draw.js')(model);

  var $display = $('<div class="summaryjs-display"></div>');
  var fields = model.fields.data;
  for (var i = 0; i < fields.length; i++) {
    if (fields[i].type != 'static') {
      $display.append(displayField(fields[i], width, height));
    }
  }
  return $display;

  function displayField(field, width, height) {
    var $display = $('<div class="summaryjs-field-display"></div>');

    var vals = model.posts.data
      .map(utility.pick(field.key))
      .filter(utility.isNonEmpty);
    $display.append(
      '<p>' +
        '(N=' + vals.length + ') ' +
        (field.title || field.key) +
      '</p>'
    );

    if (utility.isIn(field.type, ['number'])) {
      field.display = draw.histogram($display[0], width, height, vals);
    } else if (utility.isIn(field.type, ['radio', 'dropdown', 'checkbox'])) {
      field.options = optionsArray(field);
      field.display = draw.bars($display[0], width, height, vals, field.options);
    } else if (utility.isIn(field.type, ['text', 'textarea'])) {
      field.display = draw.texts($display[0], width, height, vals);
    }

    return $display;
  }

  function optionsArray(field) {
    var opts = [].concat(field.enum) || [];
    var titles = field.titleMap || {};
    return opts.map(function (key) {
      return { key: key, title: titles[key] || key };
    });
  }

};
