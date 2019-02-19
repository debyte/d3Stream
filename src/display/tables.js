var U = require('../utility.js');

C_TABLE = 'd3stream-table';

module.exports = {
  table: table,
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
