var U = require('../utility.js');

C_TABLE = 'd3stream-table';

module.exports = {
  table: table,
};

function table(display, data, options) {
  data = data[0];
  display.display.selectAll('table').remove();
  var table = display.display.append('table')
    .attr('class', C_TABLE);
  var cols = U.keys(data[0]);
  var tr = table.append('tr');
  for (var i = 0; i < cols.length; i++) {
    tr.append('th').text(cols[i]);
  }
  for (var j = 0; j < data.length; j++) {
    var row = data[j];
    console.log(row);
    tr = table.append('tr');
    for (i = 0; i < cols.length; i++) {
      tr.append('td').text(row[cols[i]]);
    }
  }
}
