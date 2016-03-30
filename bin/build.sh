#! /bin/bash

set -e
mkdir -p dist
babel src --out-dir dist/node --presets es2015
browserify ./index.js -t [ babelify --presets [ es2015 ] ] -o dist/exp-sdk.js -s EXP

uglifyjs --compress --mangle --source-map dist/exp-sdk.min.map -o dist/exp-sdk.min.js -- dist/exp-sdk.js

cp dist/exp-sdk.min.map dist/exp-sdk-${npm_package_version}.min.map
cp dist/exp-sdk.js dist/exp-sdk-${npm_package_version}.js
cp dist/exp-sdk.min.js dist/exp-sdk-${npm_package_version}.min.js