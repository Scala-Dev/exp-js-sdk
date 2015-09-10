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

module.exports = function (options) {
  config.host = options.host || config.host;
  credentials.set(options.uuid, options.secret);
  return new Promise(function (resolve) {
    resolve_ = resolve;
    credentials.generateToken()['catch'](function () {
      return '';
    }).then(function (token) {
      socket.connect({ token: token, host: config.host });
    });
  });
};