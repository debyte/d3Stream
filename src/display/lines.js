var DU = require('./utility.js');

module.exports = {
  lineDiagram: lineDiagram,
};

function lineDiagram(plot, size, domains, data, select, options) {
  var width = size.inWidth;
  var height = size.inHeight;
  var scales = DU.scaleFunctions(options);
  var t = DU.transition(options);

  var x = scales.x([0, width], domains.x, options);
  var y = scales.y([height, 0], domains.y, options);
  var z = scales.z(options.lineDotRange, domains.z, options);

  data = DU.cutToDomain(data, 'z', domains.z);

  var path = plot.select('.desummary-line');
  if (path.empty()) {
    var preLiner = d3.line()
      .x(function (d) { return x(d.x); })
      .y(y(0));
    path = plot.append('path')
      .attr('class', 'desummary-line')
      .attr('d', preLiner(data));
  }
  var liner = d3.line()
    .x(function (d) { return x(d.x); })
    .y(function (d) { return y(d.y); });
  path.transition(t).attr('d', liner(data));

  var dots = plot.selectAll('.desummary-line-dot').data(data);
  dots.enter()
    .append('circle')
    .attr('class', 'desummary-line-dot')
    .attr('cx', function(d) { return x(d.x); })
    .attr('cy', y(0))
    .attr('r', z(0))
    .on('mouseover', select.over)
    .on('mouseout', select.out)
    .on('click', select.click)
  .merge(dots)
    .transition(t)
    .attr('cx', function (d) { return x(d.x); })
    .attr('cy', function (d) { return y(d.y); })
    .attr('r', function (d) { return z(d.z); });
  dots.exit().remove();

  return { x: x, y: y };
}
