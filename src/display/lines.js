var DU = require('./utility.js');

C_DOT = 'd3stream-dot';
C_LINE = 'd3stream-line';
C_AREA = 'd3stream-area';

module.exports = {
  scatterPlot: scatterPlot,
  lineChart: lineChart,
  areaChart: areaChart,
  stackedAreaChart: stackedAreaChart
};

function scatterPlot(display, plots, axis, dataSeries, options) {
  for (var i = 0; i < dataSeries.length; i++) {
    drawDots(display, plots[i], axis, dataSeries[i], options);
  }
}

function lineChart(display, plots, axis, dataSeries, options) {
  for (var i = 0; i < dataSeries.length; i++) {
    drawLine(display, plots[i], axis, dataSeries[i], options);
  }
}

function areaChart(display, plots, axis, dataSeries, options) {
  for (var i = 0; i < dataSeries.length; i++) {
    drawArea(display, plots[i], axis, dataSeries[i], options);
  }
}

function stackedAreaChart(display, plots, axis, dataSeries, options) {
  var sdata = DU.stack(display.d3, dataSeries, axis, options);
  for (var i = 0; i < sdata.length; i++) {
    drawArea(display, plots[i], axis, sdata[i], options);
  }
}

function getCurveFactory(d3, options) {
  return options.curveLine ? d3.curveNatural : (options.stepLine ? d3.curveStep : d3.curveLinear);
}

function drawDots(display, plot, axis, data, options) {
  data = DU.cutToDomain(data, axis.z.variable, axis.z.domain);
  var trans = DU.transition(display.d3, options);
  var formatter = DU.formatter(display.d3, options);
  var group = DU.groupSelector(options);
  var dots = plot.selectAll(DU.s(C_DOT)).data(data);
  var enter = dots.enter().append('g').attr('class', C_DOT);
  enter.append('circle')
    .attr('cx', function(d) { return axis.x.pick(d); })
    .attr('cy', axis.y.pickZero())
    .attr('r', axis.z.pickMin())
    .on('mouseover', DU.event(display.select, 'over'))
    .on('mouseout', DU.event(display.select, 'out'))
    .on('click', DU.event(display.select, 'click'));
  enter.append('text')
    .attr('x', function (d) { return DU.textPadX(options, axis.x.pick(d)); })
    .attr('y', axis.y.pickZero());
  var merged = dots.merge(enter);
  merged.select('circle')
    .transition(trans)
    .attr('cx', function (d) { return axis.x.pick(d); })
    .attr('cy', function (d) { return axis.y.pick(d); })
    .attr('r', function (d) { return axis.z.pick(d) || axis.z.pickMin(); })
    .style('fill', function (d) { return DU.fill(d, axis.x, options, group(d)); })
  if (options.chartText) {
    merged.select('text')
      .transition(trans)
      .attr('x', function (d) { return DU.textPadX(options, axis.x.pick(d)); })
      .attr('y', function (d) { return DU.textPadY(options, axis.y.pick(d)); })
      .text(function (d) { return DU.text(d[axis.y.variable], formatter, axis.y.pickDistance(d), options, group(d)); });
  }
  dots.exit().remove();
}

function drawLine(display, plot, axis, data, options) {
  var trans = DU.transition(display.d3, options);
  var curve = getCurveFactory(display.d3, options);
  var group = DU.groupSelector(options);
  var path = plot.select(DU.s(C_LINE));
  if (path.empty()) {
    var enterLiner = display.d3.line()
      .x(function (d) { return axis.x.pick(d); })
      .y(axis.y.pickZero())
      .curve(curve);
    path = plot.append('path')
      .attr('class', C_LINE)
      .attr('d', enterLiner(data));
  }
  var liner = display.d3.line()
    .x(function (d) { return axis.x.pick(d); })
    .y(function (d) { return axis.y.pick(d); })
    .curve(curve);
  path.transition(trans).attr('d', liner(data));
}

function drawArea(display, plot, axis, data, options) {
  var trans = DU.transition(display.d3, options);
  var curve = getCurveFactory(display.d3, options);
  var group = DU.groupSelector(options);
  var path = plot.select(DU.s(C_AREA));
  if (path.empty()) {
    var enterArear = display.d3.area()
      .x(function (d) { return axis.x.pick(d); })
      .y0(axis.y.pickZero())
      .y1(axis.y.pickZero())
      .curve(curve);
    path = plot.append('path')
      .attr('class', C_AREA)
      .attr('d', enterArear(data));
  }
  var arear = display.d3.area()
    .x(function (d) { return axis.x.pick(d); })
    .y0(function (d) { return axis.y.pickBase(d); })
    .y1(function (d) { return axis.y.pick(d); })
    .curve(curve);
  path.transition(trans)
    .attr('d', arear(data))
    .style('fill', DU.fill({}, {}, options, group(data[0])));
}
