#! /bin/bash

set -e
mkdir -p dist
babel src --out-dir dist/node --presets es2015
browserify ./index.js -t [ babelify --presets [ es2015 ] ] -o dist/exp-sdk.js
