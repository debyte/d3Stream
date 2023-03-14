module.exports = Display;

var DisplayFrame = require('./DisplayFrame.js');
var resize = require('./resize.js');
var lines = require('./lines.js');
var bars = require('./bars.js');
var tables = require('./tables.js');

function Display(d3, element, options, data, parent, b) {
  DisplayFrame.call(this, d3, element, options, data, parent, b);

  var self = this;
  resize(d3, function () {
    self.update();
  });
}

Display.prototype = Object.create(DisplayFrame.prototype);
Display.prototype.constructor = Display;

Display.prototype.branch = function () {
  return this.addBranch(Display);
};

Display.prototype.scatterPlot = function (options) {
  return this.addChart(lines.scatterPlot, options);
};

Display.prototype.lineChart = function (options) {
  return this.addChart(lines.lineChart, options);
};

Display.prototype.areaChart = function (options) {
  return this.addChart(lines.areaChart, options);
};

Display.prototype.stackedAreaChart = function (options) {
  return this.addChart(lines.stackedAreaChart, options);
};

Display.prototype.barChart = function (options) {
  return this.addChart(bars.barChart, options);
};

Display.prototype.stackedBarChart = function (options) {
  return this.addChart(bars.stackedBarChart, options);
};

Display.prototype.groupedBarChart = function (options) {
  return this.addChart(bars.groupedBarChart, options);
};

Display.prototype.table = function (options) {
  return this.addFrame(tables.table, options);
};

Display.prototype.table2d = function (options) {
  return this.addFrame(tables.table2d, options);
};
