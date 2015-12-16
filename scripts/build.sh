#! /bin/bash

set -e
mkdir -p dist
$(npm bin)/babel lib --out-dir dist/node --presets es2015
$(npm bin)/browserify ./index.js -t [ babelify --presets [ es2015 ] ] -o dist/exp-sdk.js
