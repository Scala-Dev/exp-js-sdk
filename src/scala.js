'use strict';

var sdk = {
  connection: require('./connection'),
  credentials: require('./credentials'),
  api: require('./api'),
  channels: require('./channels')
};

if (typeof window === 'object') window.scala = sdk;

module.exports = sdk;





