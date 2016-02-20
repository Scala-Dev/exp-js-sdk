'use strict';

var exp = require('./dist/node/sdk');

if (typeof window === 'object') window.exp = exp;

module.exports = exp;