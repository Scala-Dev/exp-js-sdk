'use strict';

const runtime = require('./runtime');
const api = require('./api');
const network = require('./network');
const utils = require('./utils');

const exp = { runtime: runtime, api: api, network: network, utils: utils };
if (typeof window === 'object') window.exp = exp;

module.exports = exp;
