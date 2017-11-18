src = src/main.js
src_test = test/runner.js
out_js = out/d3Stream.js
out_test = out/d3Stream.test.js
out_min_js = out/d3Stream.min.js
out_css = out/d3Stream.css
out_min_css = out/d3Stream.min.css

.PHONY: all browserify watch uglify clean

all: browserify uglify

browserify:
	browserify $(src) -o $(out_js)
	browserify $(src_test) -o $(out_test)

watch:
	watchify $(src) -o $(out_js)

watchtest:
	watchify $(src_test) -o $(out_test)

uglify:
	uglify -s $(out_js) -o $(out_min_js)
	uglify -cs $(out_css) -o $(out_min_css)

clean:
	rm out/*.js out/*.min.css
