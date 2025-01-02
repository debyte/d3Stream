var U = require('../utility.js');
var DU = require('./utility.js');

var C_TABLE = 'd3stream-table';

module.exports = {
  table: table,
  table2d: table2d,
};

function table(display, axis, dataSeries, options) {
  display.display.selectAll('table').remove();
  var table = display.display.append('table')
    .attr('class', C_TABLE);
  var cols = U.unique(display.d3.merge(display.d3.merge(dataSeries).map(Object.keys)));
  var tr = table.append('tr');
  for (var i = 0; i < cols.length; i++) {
    tr.append('th').text(cols[i]);
  }
  for (i = 0; i < dataSeries.length; i++) {
    data = dataSeries[i];
    for (var j = 0; j < data.length; j++) {
      var row = data[j];
      tr = table.append('tr');
      for (var k = 0; k < cols.length; k++) {
        tr.append('td').text(row[cols[k]]);
      }
    }
  }
}

function table2d(display, axis, dataSeries, options) {
  var xaxis = axis[options.horizontalVariable];
  var yaxis = axis[options.verticalVariable];
  display.display.selectAll('table').remove();
  var rows = [];
  var cols = [];
  var values = [];
  for (var i = 0; i < dataSeries.length; i++) {
    for (var j = 0; j < dataSeries[i].length; j++) {
      var d = dataSeries[i][j];
      var x = xaxis.pickValue(d);
      if (!rows.includes(x)) {
        rows.push(x);
      }
      var r = values[rows.indexOf(x)] || [];
      var g = d[options.groupVariable];
      if (!cols.includes(g)) {
        cols.push(g);
      }
      r[cols.indexOf(g)] = yaxis.pickValue(d);
      values[rows.indexOf(x)] = r;
    }
  }

  // Head
  var table = display.display.append('table')
    .attr('class', C_TABLE);  
  var tr = table.append('tr');
  tr.append('th');
  var sums = [];
  var group = DU.groupSelector(options);
  for (var i = 0; i < cols.length; i++) {
    var d = Object.fromEntries([[options.groupVariable, cols[i]]]);
    tr.append('th').text(U.get(group(d), options.labelVariable) || cols[i]);
    sums[i] = 0;
  }
  tr.append('th');
  sums[i] = 0;

  // Value rows
  var formatter = DU.formatter(display.d3, options);
  for (i = 0; i < rows.length; i++) {
    tr = table.append('tr');
    tr.append('th').text(U.get(U.get(xaxis.config, rows[i]), options.labelVariable) || rows[i]);
    var s = 0;
    for (j = 0; j < cols.length; j++) {
      var y = values[i][j];
      tr.append('td').text(formatter(y));
      s += y;
      sums[j] += y;
    }
    tr.append('td').append('em').text(formatter(s));
    sums[j] += s;
  }

  // Vertical sums
  tr = table.append('tr');
  tr.append('td');
  for (i = 0; i <= cols.length; i++) {
    tr.append('td').append('em').text(formatter(sums[i]));
  }
}
