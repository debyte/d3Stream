var U = require('../utility.js');
var DU = require('./utility.js');

C_BAR = 'd3stream-bar';
C_GROUP = 'd3stream-group';

module.exports = {
  barChart: barChart,
  stackedBarChart: stackedBarChart,
  groupedBarChart: groupedBarChart,
};

function barChart(display, plots, axis, dataSeries, options) {
  for (var i = 0; i < dataSeries.length; i++) {
    drawBars(display, plots[i], axis, dataSeries[i], options);
  }
}

function stackedBarChart(display, plots, axis, dataSeries, options) {
  var sdata = DU.stack(display.d3, dataSeries, axis, options);
  for (var i = 0; i < sdata.length; i++) {
    drawBars(display, plots[i], axis, sdata[i], options);
  }
}

function groupedBarChart(display, plots, axis, dataSeries, options) {
  for (var i = 0; i < dataSeries.length; i++) {
    drawBars(display, plots[i], axis, dataSeries[i], options, [i, dataSeries.length]);
  }
}

function getBarWidth(width, scale, count, options) {
  if (scale.bandwidth) {
    return [scale.bandwidth(), true];
  } else {
    var bw = (1.0 - options.barMargin) * width / count;
    return [bw, bw / 2];
  }
}

function drawBars(display, plot, axis, data, options, banded) {
  var trans = DU.transition(display.d3, options);
  var formatter = DU.formatter(display.d3, options);
  var group = DU.groupSelector(options);
  var bw = getBarWidth(display.size.inWidth, axis.x.scale, data.length, options);
  var w = bw[0] / (banded !== undefined ? banded[1] : 1);
  var gx = banded !== undefined ? banded[0] * w : 0;
  var bars = plot.selectAll(DU.s(C_BAR)).data(data);
  var enter = bars.enter().append('g').attr('class', C_BAR);
  enter.append('rect')
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + gx; })
    .attr('y', axis.y.pickZero())
    .attr('width', w)
    .attr('height', 0)
    .on('mouseover', DU.event(display.select, 'over'))
    .on('mouseout', DU.event(display.select, 'out'))
    .on('click', DU.event(display.select, 'click'));
  enter.append('text')
    .attr('x', function (d) { return DU.textPadX(options, axis.x.pick(d, bw[1]) + gx); })
    .attr('y', axis.y.pickZero());
  var merged = bars.merge(enter);
  merged.select('rect')
    .transition(trans)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + gx; })
    .attr('y', function (d) { return options.downwards ? axis.y.pickBase(d) : axis.y.pick(d); })
    .attr('width', w)
    .attr('height', function (d) { return axis.y.pickDistance(d); })
    .style('fill', function (d) { return DU.fill(d, axis.x, options, group(d)); });
  if (options.chartText) {
    merged.select('text')
      .transition(trans)
      .attr('x', function (d) { return DU.textPadX(options, axis.x.pick(d, bw[1]) + gx); })
      .attr('y', function (d) { return DU.textPadY(options, axis.y.pick(d)); })
      .text(function (d) { return DU.text(axis.y.pickValue(d), formatter, axis.y.pickDistance(d), options, group(d)); });
  }
  bars.exit().remove();
}
