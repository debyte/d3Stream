# d3Stream

A data stream library to create interactive data summaries using
[D3.js](https://d3js.org/)

The stream supports different data transformations, such as map and filter.
It also includes one-liner commands to create different visualizations,
such as bar and line charts. The visualizations focus on data and have minimum
extra elements. The SVG presentation is controlled via CSS styles.

The visualizations offer javascript hooks to attach UI interactions. The data
stream can be re-transformed or updated from a source and all the attached
visualizations will automatically update. For example, the stream can load an
HTTP request and the stream will automatically compute at response time.

See [out/index.html](out/index.html) for example.
