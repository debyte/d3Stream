var U = require('../utility.js');
var DU = require('./utility.js');

module.exports = {
  barDiagram: barDiagram,
  stackedBarDiagram: stackedBarDiagram,
  groupedBarDiagram: groupedBarDiagram,
};

function barDiagram(plot, size, axis, data, select, options) {
  var width = size.inWidth;
  var height = size.inHeight;
  prepareAxis(axis, width, height);
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
    .on('mouseover', select.over)
    .on('mouseout', select.out)
    .on('click', select.click)
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', function (d) { return axis.y.pick(d); })
    .attr('width', bw[0])
    .attr('height', function (d) { return height - axis.y.pick(d); });
  bars.exit().remove();
}

function stackedBarDiagram(plot, size, axis, data, select, options) {
  data = U.reduce(
    data,
    function (data, d) {
      var l = data.length > 0 ? data[data.length - 1].sy[1] : 0;
      d.sy = [ l, l + d[axis.y.a] ];
      data.push(d);
      return data;
    },
    []
  );
  axis.y.domain = [0, d3.max(data, function(d) { return d.sy[1]; })];

  var width = size.inWidth;
  var height = size.inHeight;
  prepareAxis(axis, width, height);
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
    .on('mouseover', select.over)
    .on('mouseout', select.out)
    .on('click', select.click)
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]); })
    .attr('y', function (d) { return axis.y.scale(d.sy[1]); })
    .attr('width', bw[0])
    .attr('height', function (d) {
      return axis.y.scale(d.sy[0]) - axis.y.scale(d.sy[1]);
    });
  bars.exit().remove();
}

function groupedBarDiagram(plot, size, axis, data, select, options) {
  var width = size.inWidth;
  var height = size.inHeight;
  prepareAxis(axis, width, height);
  var bw = getBarWidth(width, axis.x.scale, data.length, options);
  var t = DU.transition(options);

  var g = d3.scaleBand()
    .domain(U.map(data, U.pick('x')))
    .rangeRound([0, bw[0]]);
  var gw = g.bandwidth();

  var bars = plot.selectAll('.desummary-bar').data(data);
  bars.enter()
    .append('rect')
    .attr('class', 'desummary-bar')
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + g(d.x); })
    .attr('y', axis.y.scale(0))
    .attr('width', gw)
    .attr('height', 0)
    .on('mouseover', select.over)
    .on('mouseout', select.out)
    .on('click', select.click)
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return axis.x.pick(d, bw[1]) + g(d.x); })
    .attr('y', function (d) { return axis.y.pick(d); })
    .attr('width', gw)
    .attr('height', function (d) { return height - axis.y.pick(d); });
  bars.exit().remove();
}

function prepareAxis(axis, width, height) {
  axis.x.scale.rangeRound([0, width]);
  axis.y.domain = [
    Math.min(0, axis.y.domain[0]),
    Math.max(0, axis.y.domain[1])
  ];
  axis.y.scale.domain(axis.y.domain).rangeRound([height, 0]);
}

function getBarWidth(width, scale, count, options) {
  if (scale.bandwidth) {
    return [scale.bandwidth(), 0];
  } else {
    var bw = (1.0 - options.barMargin) * width / count;
    return [bw, bw / 2];
  }
}
