'use strict';

const lib = require('./lib');

const sdk = new lib.Context();

if (typeof window === 'object') window.exp = sdk;

module.exports = sdk;
