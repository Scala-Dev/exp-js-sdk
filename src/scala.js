'use strict';

var sdk = {
  init: require('./init'),
  config: require('./config'),
  api: require('./api'),
  connection: require('./connection'),
  channels: require('./channels'),
  utilities: require('./utilities')
};

if (typeof window === 'object') window.scala = sdk;

module.exports = sdk;





