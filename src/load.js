var transform = require('./transform.js');

module.exports = function (options, update) {

  if (options.url) {
    if (options.format == 'csv') {
      d3.csv(options.url, onLoad);
    } else if (options.format == 'tsv') {
      d3.tsv(options.url, onLoad);
    } else if (options.format == 'xml') {
      d3.xml(options.url, onLoad);
    } else {
      d3.json(options.url, onLoad);
    }
  } else {
    onLoad(undefined, options.data || []);
  }

  function onLoad(error, data) {
    if (error) throw error;
    update(
      transform._apply([].concat(data), options.transform),
      options.target,
      options.append
    );
  }

};
