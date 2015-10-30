'use strict';

const config = require('./config');
const credentials = require('./credentials');
const socket = require('./socket');
const utilities = require('./utilities');

const events = new utilities.EventNode();
var resolve_;

socket.events.on('online', () => {
  events.trigger('online');
  if (!resolve_) return;
  resolve_();
  resolve_ = null;
});

socket.events.on('offline', () => {
  events.trigger('offline');
});

module.exports.start = options => {
  options = options || {};
  config.host = options.host || config.host;
  if ((options.uuid || options.deviceUuid) && options.secret) {
    credentials.setDeviceCredentials(options.uuid || options.deviceUuid, options.secret);
  } else if (options.networkUuid && options.apiKey) {
    credentials.setNetworkCredentials(options.networkUuid, options.apiKey);
  } else if (options.username && options.password && options.organization) {
    credentials.setUserCredentials(options.username, options.password, options.organization);
  } else if (options.token) {
    credentials.setToken(options.token);
  }
  return new Promise((resolve, reject) => {
    resolve_ = resolve;
    return credentials.getToken()
      .then(token => {
        socket.connect({ token: token, host: config.host });
      })
      .catch(reject)
  });
};

module.exports.stop = () => {
  credentials.clear();
  socket.disconnect();
};

module.exports.on = events.on;
