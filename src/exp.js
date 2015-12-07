'use strict';

const runtime = require('./components/runtime');
const api = require('./components/api');
const network = require('./components/network');

const context = {};

const exp = {
  runtime: runtime.getDelegate(context),
  api: api.getDelegate(context),
  network: network.getDelegate(context),
  lib: {
    components: {
      runtime: runtime,
      api: api,
      network: network
    }
  }
};

if (typeof window === 'object') window.exp = exp;

module.exports = exp;
