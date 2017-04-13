# vusion-doc-loader

Generator docs automatically according to `README.md` and jsdoc-format comments in multifile vue directory.

``` javascript
module: {
    rules: [
        { test: /\.vue[\\/]index\.js$/, loader: 'vusion-doc-loader' },
    ],
}
```
