'use strict';

const lib = require('./utilities');

const sdk = new lib.Context();

if (typeof window === 'object') window.exp = sdk;

module.exports = sdk;
