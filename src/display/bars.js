var U = require('../utility.js');
var DU = require('./utility.js');

C_BAR = 'd3stream-bar';
C_GROUP = 'd3stream-group';

module.exports = {
  barChart: barChart,
  barChartDownwards: barChartDownwards,
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

function getBarFill(axis, d) {
  var g = axis.config;
  if (g) {
    var v = d[axis.variable];
    var i = g[v];
    if (i) {
      return i.color;
    }
  }
  return undefined;
}

function barChart(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var bw = getBarWidth(width, axis.x.scale, data.length, options);
  var t = DU.transition(display.d3, options);

  var bars = plot.selectAll(DU.s(C_BAR)).data(data);
  bars.enter()
    .append('rect')
    .attr('class', C_BAR)
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
    .attr('height', function (d) { return height - axis.y.pick(d); })
    .style('fill', function (d) { return getBarFill(axis.x, d) });
  bars.exit().remove();
}

function barChartDownwards(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var bw = getBarWidth(width, axis.x.scale, data.length, options);
  var t = DU.transition(display.d3, options);
  axis.y.scale.rangeRound([0, height]);

  var bars = plot.selectAll(DU.s(C_BAR)).data(data);
  bars.enter()
    .append('rect')
    .attr('class', C_BAR)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', 0)
    .attr('width', bw[0])
    .attr('height', 0)
    .on('mouseover', DU.event(display.select, 'over'))
    .on('mouseout', DU.event(display.select, 'out'))
    .on('click', DU.event(display.select, 'click'))
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', function (d) { return 0; })
    .attr('width', bw[0])
    .attr('height', function (d) { return axis.y.pick(d); });
  bars.exit().remove();
}

function stackedBarChart(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var bw = getBarWidth(width, axis.x.scale, data.length, options);
  var t = DU.transition(display.d3, options);

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
  axis.y.domain = [0, display.d3.max(data, function(d) { return d.sy[1]; })];
  axis.y.scale.domain(axis.y.domain);
  var groupVar = options.groupVariable || 'group';

  var bars = plot.selectAll(DU.s(C_BAR)).data(data);
  bars.enter()
    .append('rect')
    .attr('class', function (d) { return DU.a(C_BAR, [C_GROUP, d[groupVar]].join('-')); })
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
  var t = DU.transition(display.d3, options);

  var groupVar = options.groupVariable || 'group';
  var g = display.d3.scaleBand()
    .domain(U.map(data, U.pick(groupVar)))
    .rangeRound([0, bw[0]]);
  var gw = g.bandwidth();

  var bars = plot.selectAll(DU.s(C_BAR)).data(data);
  bars.enter()
    .append('rect')
    .attr('class', function (d) { return DU.a(C_BAR, [C_GROUP, d[groupVar]].join('-')); })
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + g(d[groupVar]); })
    .attr('y', axis.y.scale(0))
    .attr('width', gw)
    .attr('height', 0)
    .on('mouseover', DU.event(display.select, 'over'))
    .on('mouseout', DU.event(display.select, 'out'))
    .on('click', DU.event(display.select, 'click'))
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + g(d[groupVar]); })
    .attr('y', function (d) { return axis.y.pick(d); })
    .attr('width', gw)
    .attr('height', function (d) { return height - axis.y.pick(d); });
  bars.exit().remove();
}
