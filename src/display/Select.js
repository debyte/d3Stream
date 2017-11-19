module.exports = Select;

var U = require('../utility.js');
var DU = require('./utility.js');
var C_FOCUS = 'd3stream-focus';
var C_SELECTION = 'd3stream-selection';
var C_FOCUS_SELECTION = 'd3stream-focus-selection';

function Select(options) {
  this.config = options;
  this.svgs = d3.select();
  this.selected = [];
  this.data = {};
}

Select.prototype.register = function (svg) {
  this.svgs = this.svgs.merge(svg);
};

Select.prototype.clear = function () {
  this.svgs.selectAll(DU.s(C_SELECTION)).classed(C_SELECTION, false);
  U.empty(this.selected);
};

Select.prototype.event = function (type, control, d, i) {
  switch (type) {
    case 'over':
      this.over(control);
      break;
    case 'out':
      this.out(control);
      break;
    case 'click':
      this.click(control);
      break;
  }
  if (this.config.select && this.config.select[type]) {
    this.config.select[type](this, control.__data__);
  }
};

Select.prototype.over = function (control) {
  if (control.classed(C_SELECTION)) {
    control.classed(C_FOCUS_SELECTION, true);
  } else {
    control.classed(C_FOCUS, true);
  }
  d3.select(control.node().parentNode).classed(C_FOCUS, true).raise();
};

Select.prototype.out = function (control) {
  control.classed(DU.a(C_FOCUS, C_FOCUS_SELECTION), false);
  d3.select(control.node().parentNode).classed(C_FOCUS, false);/*.lower();*/
};

Select.prototype.click = function (control) {
  if (!U.isIn(control.node(), this.selected)) {
    this.selected.push(control.node());
    control.classed(C_SELECTION, true);
    d3.select(control.node().parentNode).classed(C_SELECTION, true);
  } else {
    U.removeFrom(control.node(), this.selected);
    control
      .classed(DU.a(C_SELECTION, C_FOCUS_SELECTION), false)
      .classed(C_FOCUS, true);
    var plot = d3.select(control.node().parentNode);
    if (plot.select(DU.s(C_SELECTION)).empty()) {
      plot.classed(C_SELECTION, false);
    }
  }
};
