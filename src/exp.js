'use strict';

const Runtime = require('./components/Runtime');
const Network = require('./components/Network');

const models = require('./models');

const sdk = {
  runtime: new Runtime(),
  api: require('./api'),
  bus: require('./bus'),
  channels: require('./channels'),
  config: require('./config'), // Deprecated
  connection: require('./connection'), // Deprecated
  lib: require('./lib'),
  utilities: require('./lib'), // Deprecated
  models: models,
  network: new Network(),
  components: {
    Runtime: Runtime,
    Network: Network
  }
};

sdk.init = sdk.runtime.start;


if (typeof window === 'object') window.exp =sdk;

module.exports = sdk;
