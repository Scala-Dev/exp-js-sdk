'use strict';

var sdk = {
  init: require('./init'),
  config: require('./config'),
  api: require('./api'),
  connection: require('./connection'),
  channels: require('./channels'),
  utilities: require('./utilities'),
  runtime: require('./runtime')
};

if (typeof window === 'object') window.exp = sdk;

module.exports = sdk;





