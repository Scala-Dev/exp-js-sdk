'use strict';

var lib = require('./utilities');

var sdk = new lib.Context();

if (typeof window === 'object') window.exp = sdk;

module.exports = sdk;