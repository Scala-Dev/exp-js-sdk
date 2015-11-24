'use strict';

const lib = require('../lib');
const socket = require('../socket');
const credentials = require('../credentials');

const config = require('../config');

const runtimes = [];

let startResolver;

module.exports = class Runtime {

  constructor () {
    this.events = new lib.EventNode();
    this.on = this.events.on;
    this.config = config;
    runtimes.push(this);
  }

  start (options) {
    options = options || {};
    options.deviceUuid = options.uuid || options.deviceUuid;
    options.deviceSecret = options.secret || options.deviceSecret;
    config.host = options.host || config.host;

    if (options.deviceUuid && options.deviceSecret) {
      config.deviceUuid = options.deviceUuid;
      credentials.setDeviceCredentials(options.deviceUuid, options.deviceSecret, options.allowPairing);
    } else if (options.networkUuid && options.apiKey) {
      credentials.setNetworkCredentials(options.networkUuid, options.apiKey);
    } else if (options.username && options.password && options.organization) {
      credentials.setUserCredentials(options.username, options.password, options.organization);
    } else if (options.token) {
      credentials.setToken(options.token);
    }
    return new Promise((resolve, reject) => {
      startResolver= resolve;
      return credentials.getToken()
        .then(token => {
          socket.connect({ token: token, host: config.host });
        })
        .catch(reject);
    });
  }

  stop () {
    credentials.clear();
    socket.disconnect();
  }

};

socket.events.on('online', () => {
  runtimes.forEach(runtime => {
    runtime.events.trigger('online');
  });
  if (!startResolver) return;
  startResolver();
  startResolver = null;
});

socket.events.on('offline', () => {
  runtimes.forEach(runtime => {
    runtime.events.trigger('offline');
  });
});
