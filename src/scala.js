'use strict';

const Interface = require('./interface');

var sdk = {
  connection: require('./connection'),
  credentials: require('./credentials'),
  api: require('./api'),
  utilities: require('./utilities'),
  channels: {
    system: new Interface('system'),
    organization: new Interface('organization'),
    experience: new Interface('experience'),
    location: new Interface('location')
  }
};

if (typeof window === 'object') window.scala = sdk;

module.exports = sdk;





