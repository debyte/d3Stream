src = src/main.js
out_js = out/desummary.js
out_min_js = out/desummary.min.js
out_css = out/desummary.css
out_min_css = out/desummary.min.css

.PHONY: all browserify watch uglify clean

all: browserify uglify

browserify:
	browserify $(src) -o $(out_js)

watch:
	watchify $(src) -o $(out_js)

uglify:
	uglify -s $(out_js) -o $(out_min_js)
	uglify -cs $(out_css) -o $(out_min_css)

clean:
	rm out/*.js out/*.min.css
