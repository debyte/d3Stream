var DU = require('./utility.js');

module.exports = {
  lineDiagram: lineDiagram,
};

function lineDiagram(plot, size, axis, data, select, options) {
  var width = size.inWidth;
  var height = size.inHeight;
  axis.x.scale.rangeRound([0, width]);
  axis.y.scale.rangeRound([height, 0]);
  axis.z.scale.rangeRound(options.lineDotRange);
  var t = DU.transition(options);

  data = DU.cutToDomain(data, 'z', axis.z.domain);

  var path = plot.select('.desummary-line');
  if (path.empty()) {
    var preLiner = d3.line()
      .x(function (d) { return axis.x.pick(d); })
      .y(axis.y.scale(0));
    path = plot.append('path')
      .attr('class', 'desummary-line')
      .attr('d', preLiner(data));
  }
  var liner = d3.line()
    .x(function (d) { return axis.x.pick(d); })
    .y(function (d) { return axis.y.pick(d); });
  path.transition(t).attr('d', liner(data));

  var dots = plot.selectAll('.desummary-line-dot').data(data);
  dots.enter()
    .append('circle')
    .attr('class', 'desummary-line-dot')
    .attr('cx', function(d) { return axis.x.pick(d); })
    .attr('cy', axis.y.scale(0))
    .attr('r', axis.z.scale(0))
    .on('mouseover', select.over)
    .on('mouseout', select.out)
    .on('click', select.click)
  .merge(dots)
    .transition(t)
    .attr('cx', function (d) { return axis.x.pick(d); })
    .attr('cy', function (d) { return axis.y.pick(d); })
    .attr('r', function (d) { return axis.z.pick(d); });
  dots.exit().remove();
}
