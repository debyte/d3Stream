var DU = require('./utility.js');

C_LINE = 'd3stream-line';
C_DOT = 'd3stream-dot';

module.exports = {
  scatterPlot: scatterPlot,
  lineChart: lineChart,
};

function getAxis(display, data, width, height, options) {
  var axis = {
    x: display.axis(data, options.horizontalVariable || 'x'),
    y: display.axis(data, options.verticalVariable || 'y'),
    z: display.axis(data, options.scaleVariable || 'z'),
  };
  axis.x.scale.rangeRound([0, width]);
  axis.y.scale.rangeRound([height, 0]);
  axis.z.scale.rangeRound(options.lineDotRange);
  return axis;
}

function scatterPlot(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var t = DU.transition(options);
  data = DU.cutToDomain(data, axis.z.variable, axis.z.domain);
  drawDots(plot, data, t, axis, display.select);
}

function lineChart(display, plot, fullData, serieIndex, options) {
  var width = display.size.inWidth;
  var height = display.size.inHeight;
  var axis = getAxis(display, fullData, width, height, options);
  var data = fullData[serieIndex];
  var t = DU.transition(options);
  data = DU.cutToDomain(data, axis.z.variable, axis.z.domain);

  var path = plot.select(DU.s(C_LINE));
  if (path.empty()) {
    var preLiner = d3.line()
      .x(function (d) { return axis.x.pick(d); })
      .y(axis.y.scale(0));
    if (options.curveLine) {
      preLiner.curve(d3.curveNatural);
    }
    path = plot.append('path')
      .attr('class', C_LINE)
      .attr('d', preLiner(data));
  }
  var liner = d3.line()
    .x(function (d) { return axis.x.pick(d); })
    .y(function (d) { return axis.y.pick(d); });
  if (options.curveLine) {
    liner.curve(d3.curveNatural);
  }
  path.transition(t).attr('d', liner(data));

  drawDots(plot, data, t, axis, display.select);
}

function drawDots(plot, data, t, axis, select) {
  var dots = plot.selectAll(DU.s(C_DOT)).data(data);
  dots.enter()
    .append('circle')
    .attr('class', C_DOT)
    .attr('cx', function(d) { return axis.x.pick(d); })
    .attr('cy', axis.y.scale(0))
    .attr('r', axis.z.scale(0))
    .on('mouseover', DU.event(select, 'over'))
    .on('mouseout', DU.event(select, 'out'))
    .on('click', DU.event(select, 'click'))
  .merge(dots)
    .transition(t)
    .attr('cx', function (d) { return axis.x.pick(d); })
    .attr('cy', function (d) { return axis.y.pick(d); })
    .attr('r', function (d) { return axis.z.pick(d); });
  dots.exit().remove();
}
