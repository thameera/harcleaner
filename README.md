# HAR Cleaner

Clean up HAR files by removing unnecessary requests.

## Building

Opening `index.html` directly in the browser will work in development mode.

To build the minified distribution HTML file, you need to have `terser` and `uglifycss` installed. If you don't have them, install both with `npm install -g terser uglifycss` first.

Afterwards, run the build file:

```
./build
```

Output will be created as `dist/index.html`.
