var U = require('../utility.js');
var DU = require('./utility.js');

module.exports = {
  barChart: barChart,
  stackedBarChart: stackedBarChart,
  groupedBarChart: groupedBarChart,
};

function getAxis(display, data, width, height, options) {
  var axis = {
    x: display.axis(data, options.horizontalVariable || 'x'),
    y: display.axis(data, options.verticalVariable || 'y'),
  };
  axis.x.scale.rangeRound([0, width]);
  axis.y.domain = [
    Math.min(0, axis.y.domain[0]),
    Math.max(0, axis.y.domain[1])
  ];
  axis.y.scale.domain(axis.y.domain).rangeRound([height, 0]);
  return axis;
}

function getBarWidth(width, scale, count, options) {
  if (scale.bandwidth) {
    return [scale.bandwidth(), 0];
  } else {
    var bw = (1.0 - options.barMargin) * width / count;
    return [bw, bw / 2];
  }
}

function barChart(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var bw = getBarWidth(width, axis.x.scale, data.length, options);
  var t = DU.transition(options);

  var bars = plot.selectAll('.desummary-bar').data(data);
  bars.enter()
    .append('rect')
    .attr('class', 'desummary-bar')
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', axis.y.scale(0))
    .attr('width', bw[0])
    .attr('height', 0)
    .on('mouseover', DU.event(display.select, 'over'))
    .on('mouseout', DU.event(display.select, 'out'))
    .on('click', DU.event(display.select, 'click'))
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', function (d) { return axis.y.pick(d); })
    .attr('width', bw[0])
    .attr('height', function (d) { return height - axis.y.pick(d); });
  bars.exit().remove();
}

function stackedBarChart(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var bw = getBarWidth(width, axis.x.scale, data.length, options);
  var t = DU.transition(options);

  data = U.reduce(
    options.reverseStack ? data.reverse() : data,
    function (data, d) {
      var l = data.length > 0 ? data[data.length - 1].sy[1] : 0;
      d.sy = [ l, l + Math.abs(d[axis.y.variable]) ];
      data.push(d);
      return data;
    },
    []
  );
  axis.y.domain = [0, d3.max(data, function(d) { return d.sy[1]; })];
  axis.y.scale.domain(axis.y.domain);

  var bars = plot.selectAll('.desummary-bar').data(data);
  bars.enter()
    .append('rect')
    .attr('class', function (d) { return 'desummary-bar desummary-group-' + d[axis.x.variable]; })
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', axis.y.scale(0))
    .attr('width', bw[0])
    .attr('height', 0)
    .on('mouseover', DU.event(display.select, 'over'))
    .on('mouseout', DU.event(display.select, 'out'))
    .on('click', DU.event(display.select, 'click'))
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', function (d) { return axis.y.scale(d.sy[1]); })
    .attr('width', bw[0])
    .attr('height', function (d) { return axis.y.scale(d.sy[0]) - axis.y.scale(d.sy[1]); });
  bars.exit().remove();
}

function groupedBarChart(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var bw = getBarWidth(width, axis.x.scale, data.length, options);
  var t = DU.transition(options);

  var g = d3.scaleBand()
    .domain(U.map(data, U.pick('x')))
    .rangeRound([0, bw[0]]);
  var gw = g.bandwidth();

  var bars = plot.selectAll('.desummary-bar').data(data);
  bars.enter()
    .append('rect')
    .attr('class', function (d) { return 'desummary-bar desummary-bar-' + d[axis.x.variable]; })
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + g(d[axis.x.variable]); })
    .attr('y', axis.y.scale(0))
    .attr('width', gw)
    .attr('height', 0)
    .on('mouseover', DU.event(display.select, 'over'))
    .on('mouseout', DU.event(display.select, 'out'))
    .on('click', DU.event(display.select, 'click'))
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + g(d[axis.x.variable]); })
    .attr('y', function (d) { return axis.y.pick(d); })
    .attr('width', gw)
    .attr('height', function (d) { return height - axis.y.pick(d); });
  bars.exit().remove();
}
