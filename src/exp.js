'use strict';

const runtime = require('./components/runtime');
const api = require('./components/api');

const sdk = {
  runtime: runtime.getProxy({}),
  api: api.getProxy({}),
  lib: {
    components: {
      runtime: runtime,
      api: api
    }
  }
};

if (typeof window === 'object') window.exp =sdk;

module.exports = sdk;
