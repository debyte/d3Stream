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

Select.prototype.isSelected = function (d) {
  return U.isIn(d, this.selected);
};

Select.prototype.select = function (d) {
  this.selected.push(d);
};

Select.prototype.deselect = function (d) {
  U.removeFrom(d, this.selected);
};

Select.prototype.event = function (type, control, d, i) {
  if (this.config.selectPlot) {
    selectPlot[type](this, control, d);
  } else {
    selectShape[type](this, control, d);
  }
  if (this.config.select && this.config.select[type]) {
    this.config.select[type](this, d);
  }
};

var selectShape = {

  over: function (select, control, d) {
    if (control.classed(C_SELECTION)) {
      control.classed(C_FOCUS_SELECTION, true);
    } else {
      control.classed(C_FOCUS, true);
    }
  },

  out: function (select, control, d) {
    control.classed(DU.a(C_FOCUS, C_FOCUS_SELECTION), false);
  },

  click: function (select, control, d) {
    if (!select.isSelected(d)) {
      select.select(d);
      control.classed(DU.a(C_SELECTION, C_FOCUS_SELECTION), true)
        .classed(C_FOCUS, false);
    } else {
      select.deselect(d);
      control.classed(DU.a(C_SELECTION, C_FOCUS_SELECTION), false)
        .classed(C_FOCUS, true);
    }
  },
};

var selectPlot = {

  over: function (select, control, d) {
    var plot = d3.select(control.node().parentNode);
    if (plot.classed(C_SELECTION)) {
      plot.classed(C_FOCUS_SELECTION, true).raise();
    } else {
      plot.classed(C_FOCUS, true).raise();
    }
  },

  out: function (select, control, d) {
    var plot = d3.select(control.node().parentNode);
    plot.classed(DU.a(C_FOCUS, C_FOCUS_SELECTION), false);/*.lower();*/
  },

  click: function (select, control, d) {
    var plot = d3.select(control.node().parentNode);
    if (!select.isSelected(d.payload)) {
      select.select(d.payload);
      plot.classed(DU.a(C_SELECTION, C_FOCUS_SELECTION), true)
        .classed(C_FOCUS, false);
    } else {
      select.deselect(d.payload);
      plot.classed(DU.a(C_SELECTION, C_FOCUS_SELECTION), false)
        .classed(C_FOCUS, true);
    }
  },
};
