var DU = require('./utility.js');

module.exports = {
  barDiagram: barDiagram,
};

function barDiagram(plot, size, domains, data, select, options) {
  var width = size.inWidth;
  var height = size.inHeight;
  var barWidth = (1.0 - options.barMargin) * width / data.length;
  var scales = DU.scaleFunctions(options);
  var t = DU.transition(options);

  var x = scales.x([0, width], domains.x, options);
  var y = scales.y([height, 0], domains.y, options);

  var bars = plot.selectAll('.desummary-bar').data(data);
  bars.enter()
    .append('rect')
    .attr('class', 'desummary-bar')
    .attr('x', function (d) { return x(d.x) - barWidth / 2; })
    .attr('y', y(0))
    .attr('width', barWidth)
    .attr('height', 0)
    .on('mouseover', select.over)
    .on('mouseout', select.out)
    .on('click', select.click)
  .merge(bars)
    .transition(t)
    .attr('x', function (d) { return x(d.x) - barWidth / 2; })
    .attr('y', function (d) { return y(d.y); })
    .attr('width', barWidth)
    .attr('height', function (d) { return height - y(d.y); });
  bars.exit().remove();

  return { x: x, y: y };
}

/*
    histogram: function (element, outWidth, outHeight, vals) {
      return init(element, outWidth, outHeight, update, vals);

      function update(vals) {
        vals = vals.map(utility.toNumber).filter(utility.isNotNaN);
        var min = d3.min(vals), max = d3.max(vals), d = max - min;
        var bins = d3.histogram()
          .domain([d > 0 ? min : (min - 0.5), d > 0 ? max : (max + 0.5)])
          .thresholds(model.histogramBands)
          (vals);
        var width = inWidth(outWidth, bins.length);
        var height = inHeight(outHeight);

        var x = d3.scaleLinear().range([0, width]).domain([
          d3.min(bins, utility.pick('x0')),
          d3.max(bins, utility.pick('x1')),
        ]).nice();
        var y = d3.scaleLinear().range([height, 0]).domain([
          0,
          d3.max(bins, utility.pick('length')),
        ]);

        var g = selectPlotWithAxis(element, x, y, bins.length, height);
        g.selectAll('.d3-bin')
          .data(bins)
        .enter()
          .append('rect')
          .attr('class', 'd3-bin')
          .attr('shape-rendering', 'crispEdges')
          .attr('x', function (d) { return x(d.x0); })
          .attr('y', function (d) { return y(d.length); })
          .attr('width', function (d) { return x(d.x1) - x(d.x0); })
          .attr('height', function (d) { return height - y(d.length); })
        .exit()
          .remove();
      }
    },

    bars: function (element, outWidth, outHeight, vals, opts) {
      return init(element, outWidth, outHeight, update, vals);

      function update(vals) {
        var counts = utility.countEach(utility.splitEach(vals, '|'));
        var width = inWidth(outWidth, opts.length);
        var height = inHeight(outHeight);

        var x = d3.scaleBand().range([0, width])
          .padding(model.bandPadding)
          .domain(opts.map(utility.pick('title')));
        var y = d3.scaleLinear().range([height, 0]).domain([
          0,
          d3.max(utility.values(counts)),
        ]);

        var g = selectPlotWithAxis(element, x, y, opts.length, height);
        g.selectAll('.d3-bar')
          .data(opts)
        .enter()
          .append('rect')
          .attr('class', 'd3-bar')
          .attr('shape-rendering', 'crispEdges')
          .attr('x', function (d) { return x(d.title); })
          .attr('y', function (d) { return y(counts[d.key] || 0); })
          .attr('width', x.bandwidth())
          .attr('height', function (d) { return height - y(counts[d.key] || 0); })
        .exit()
          .remove();
      }
    },

    texts: function (element, outWidth, outHeight, vals) {
      update(vals);
      return { update: update };

      function update(vals) {
        var $e = $(element).find('.text-values');
        if ($e.length === 0) {
          $e = $('<div class="text-values text-values-minimized"></div>');
          $e.append(
            $('<a class="handle" href="#"><span class="glyphicon glyphicon-option-horizontal"></span></a>')
              .on('click', onHandleClick)
          );
          $(element).append($e);
        } else {
          $e.empty();
        }

        var texts = [];
        var counts = {};
        for (var i = 0; i < vals.length; i++) {
          var t = vals[i];
          var n = (counts[t] || 0) + 1;
          counts[t] = n;
          if (n === 1) {
            texts.push(t);
          }
        }

        for (i = 0; i < texts.length; i++) {
          var t2 = texts[i];
          var n2 = counts[t2];
          var $t = $('<pre></pre>');
          $t.text(t2);
          if (n2 > 1) {
            $t.append('<span class="count">x ' + n2 + '</span>');
          }
          $e.append($t);
        }
      }

      function onHandleClick(event) {
        event.preventDefault();
        $(this).parent().toggleClass('text-values-minimized');
      }
    },

  };
*/
