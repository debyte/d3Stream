module.exports = Display;

var DisplayFrame = require('./DisplayFrame.js');
var resize = require('./resize.js');
var lines = require('./lines.js');
var bars = require('./bars.js');
var tables = require('./tables.js');

function Display(element, options, data) {
  DisplayFrame.call(this, element, options, data);

  var self = this;
  resize(function () {
    self.update();
  });
}

Display.prototype = Object.create(DisplayFrame.prototype);
Display.prototype.constructor = Display;

Display.prototype.scatterPlot = function (options) {
  return this.addChart(lines.scatterPlot, options);
};

Display.prototype.lineChart = function (options) {
  return this.addChart(lines.lineChart, options);
};

Display.prototype.barChart = function (options) {
  return this.addChart(bars.barChart, options);
};

Display.prototype.barChartDownwards = function (options) {
  return this.addChart(bars.barChartDownwards, options);
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
