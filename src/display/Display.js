module.exports = Display;

var DisplayFrame = require('./DisplayFrame.js');
var lines = require('./lines.js');
var bars = require('./bars.js');

function Display(element, options, data) {
  DisplayFrame.call(this, element, options, data);
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

Display.prototype.stackedBarChart = function (options) {
  return this.addChart(bars.stackedBarChart, options);
};

Display.prototype.groupedBarChart = function (options) {
  return this.addChart(bars.groupedBarChart, options);
};
