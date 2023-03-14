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
  display.display.selectAll('table').remove();
  var group = DU.groupSelector(options);
  var table = display.display.append('table')
    .attr('class', C_TABLE);
  
  // Head
  var tr = table.append('tr');
  tr.append('th');
  var sums = [];
  for (var i = 0; i < dataSeries[0].length; i++) {
    var d = dataSeries[0][i];
    tr.append('th').text(U.get(group(d), options.labelVariable) || d[options.groupVariable]);
    sums[i] = 0;
  }
  tr.append('th');
  sums[i] = 0;

  // Value rows
  var xaxis = axis[options.horizontalVariable];
  var yaxis = axis[options.verticalVariable];
  for (i = 0; i < dataSeries.length; i++) {
    tr = table.append('tr');
    var x = xaxis.pickValue(dataSeries[i][0]);
    tr.append('th').text(U.get(U.get(xaxis.config, x), options.labelVariable) || x);
    var s = 0;
    for (var j = 0; j < dataSeries[i].length; j++) {
      var d = dataSeries[i][j];
      var y = yaxis.pickValue(d);
      tr.append('td').text(y);
      s += y;
      sums[j] += y;
    }
    tr.append('td').append('em').text(s);
    sums[j] += s;
  }

  // Vertical sums
  tr = table.append('tr');
  tr.append('td');
  for (i = 0; i <= dataSeries[0].length; i++) {
    tr.append('td').append('em').text(sums[i]);
  }
}
