module.exports = Stream;

var U = require('./utility.js');
var StreamTransform = require('./StreamTransform.js');
var Display = require('./display/Display.js');

function Stream(data, d3lib) {
  StreamTransform.call(this, data, d3lib);
  this.displays = [];
}

Stream.prototype = Object.create(StreamTransform.prototype);
Stream.prototype.constructor = Stream;

Stream.prototype.load = function(url, options) {
  var opt = options || {};
  var self = this;
  (opt.loader || d3loader)(url, opt, this.d3).then(function(data) {
    self.update(data, opt);
  });
  return this;

  function d3loader(url, options, d3) {
    if (options.format == 'csv') {
      return d3.csv(url, { credentials: 'same-origin' });
    } else if (options.format == 'tsv') {
      return d3.tsv(url, { credentials: 'same-origin' });
    } else if (options.format == 'xml') {
      return d3.xml(url, { credentials: 'same-origin' });
    }
    return d3.json(url, { credentials: 'same-origin' });
  }
};

Stream.prototype.branch = function() {
  var b = new Stream(this.unstream());
  this.displays.push(b);
  return b;
};

Stream.prototype.display = function(element, options) {
  var d = new Display(this.d3, element, options, this.unstream());
  this.displays.push(d);
  return d;
};

Stream.prototype.update = function(data, options) {
  var opt = options || {};
  if (data !== undefined) {
    if (opt.append) {
      this.data = this.data.concat(data);
    } else if (opt.prepend) {
      this.data = data.concat(this.data);
    } else {
      this.data = data;
    }
  }
  var transformedData = this.unstream();
  for (var i = 0; i < this.displays.length; i++) {
    this.displays[i].update(transformedData);
  }
  return this;
};

Stream.prototype.contains = function (item) {
  return this.data.includes(item);
};

Stream.prototype.containedIn = function (list) {
  return list.includes(this.data);
};

Stream.prototype.remove = function (item) {
  U.remove(this.data, item);
  this.update();
  return this;
};

Stream.prototype.empty = function (item) {
  this.data = [];
  this.update();
  return this;
};

Stream.prototype.add = function (item) {
  return this.update(item, { append: true });
};

Stream.prototype.timeInterval = function (name, sub) {
  if (name == 'hour' || (sub && name == 'day')) {
    return this.d3.timeHour;
  } else if (name == 'day' || (sub && name == 'week')) {
    return this.d3.timeDay;
  } else if (name == 'week' || (sub && name == 'month')) {
    return this.d3.timeWeek;
  } else if (name == 'month' || (sub && name == 'year')) {
    return this.d3.timeMonth;
  } else if (name == 'year') {
    return this.d3.timeYear;
  }
  return this.d3.timeDay;
};

Stream.prototype.timeFormat = function (name, sub) {
  if (name == 'hour' || (sub && name == 'day')) {
    return this.d3.timeFormat('%H');
  } else if (name == 'day' || (sub && name == 'week')) {
    return this.d3.timeFormat('%a');
  } else if (name == 'week' || (sub && name == 'month')) {
    var f = this.d3.timeFormat('%U');
    return function (t) {
      var n = 1 + parseInt(f(t));
      return n > 52 ? n - 52 : n;
    };
  } else if (name == 'month' || (sub && name == 'year')) {
    return this.d3.timeFormat('%m');
  } else if (name == 'year') {
    return this.d3.timeFormat('%Y');
  }
  return this.d3.timeFormat('%d.%m.');
}

Stream.prototype.colorScale = function () {
  return this.d3.scaleOrdinal(this.d3.schemePaired);
}
