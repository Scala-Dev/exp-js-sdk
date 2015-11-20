'use strict';

var sdk = {
  init: require('./init'),
  config: require('./config'),
  api: require('./api'),
  lib: require('./lib'),
  connection: require('./connection'),
  channels: require('./channels'),
  runtime: require('./runtime')
};

if (typeof window === 'object') window.exp = sdk;

module.exports = sdk;