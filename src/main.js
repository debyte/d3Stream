/* Blatantly write over global deSummary. */
window.deSummary = function(element, options) {
  'use strict';

  var $element = $(element);
  var model = require('./config.js')(options);
  var load = require('./load.js');
  var display = require('./display.js');

  load(model.fields, onFormFields);
  return {
    model: model,
    redraw: redraw,
  };

  function onFormFields(error) {
    if (error) console.log(error);
    load(model.posts, onFormPosts);
  }

  function onFormPosts(error) {
    if (error) console.log(error);
    redraw();
  }

  function redraw() {
    $element.filter('.summaryjs-display').remove();
    $element.append(display(
      model,
      model.width || $element.width(),
      model.height)
    );
  }

};
