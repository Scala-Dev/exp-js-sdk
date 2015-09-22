'use strict';

var config = require('./config');
var credentials = require('./credentials');
var socket = require('./socket');

var resolve_;

socket.events.on('online', function () {
  if (!resolve_) return;
  resolve_();
  resolve_ = null;
});

module.exports.start = function (options) {
  options = options || {};
  config.host = options.host || config.host;
  if (options.uuid && options.secret) {
    credentials.setDeviceCredentials(options.uuid, options.secret);
  } else if (options.username && options.password && options.organization) {
    credentials.setUserCredentials(options.username, options.password, options.organization);
  } else if (options.token) {
    credentials.setToken(options.token);
  }
  return new Promise(function (resolve, reject) {
    resolve_ = resolve;
    return credentials.getToken().then(function (token) {
      socket.connect({ token: token, host: config.host });
    });
  });
};

module.exports.stop = function () {
  credentials.clear();
  socket.disconnect();
};