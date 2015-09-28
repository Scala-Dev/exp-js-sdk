'use strict';

const config = require('./config');
const credentials = require('./credentials');
const socket = require('./socket');

var resolve_;

socket.events.on('online', () => {
  if (!resolve_) return;
  resolve_();
  resolve_ = null;
});

module.exports = options => {
  config.host = options.host || config.host;
  credentials.set(options.uuid, options.secret);
  return new Promise(resolve => {
    resolve_ = resolve;
    credentials.generateToken()
      .catch(() => '')
      .then(token => {
        socket.connect({ token: token, host: config.host });        
      });
  });
};
