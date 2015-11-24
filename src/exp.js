'use strict';

const components = require('./components');
const models = require('./models');

const sdk = {
  runtime: new components.Runtime(),
  api: require('./api'),
  bus: require('./bus'),
  channels: require('./channels'),
  config: require('./config'), // Deprecated
  connection: require('./connection'), // Deprecated
  lib: require('./lib'),
  utilities: require('./lib'), // Deprecated
  components: components,
  models: models
};

sdk.init = sdk.runtime.start;


if (typeof window === 'object') window.exp =sdk;

module.exports = sdk;
