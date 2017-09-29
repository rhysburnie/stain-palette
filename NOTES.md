#v 0.1.0

Removed rollup.
Using plain babel-cli for build.

Modified command scripts:

```
"scripts": {
  "test": "ava",
  "lint": "eslint .",
  "build": "babel --ignore=**/*.test.js src -d dist --source-maps",
  "prepare": "npm run build",
  "clean": "rm -rf dist test-dist",
  "test:build": "babel src -d test-dist && ava test-dist/*.test.js test-dist/**/*.test.js test-dist/**/**/*.test.js"
}
```

`test:build` confirms tests pass on transpiled files.

# v0.0.0

Palette works and so do the react Provider / HOC (I think) but went
overboard with the examples.
Not sure if getting false positives in tests or not. When I tried
this out in another project the example react table failed,
could be due to the way it's bundled with rollup not sure, think I
might just use plain babel for builds and maybe drop example at this stage,
it was an attempt to see if it works as expected but not sure its a good test.
