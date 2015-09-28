'use strict';

var socket = require('./socket');

var Interface = function Interface(channel) {
  var _this = this;

  var self = this;

  this.requests = {};
  this.responders = {};
  this.listeners = {};

  this.broadcast = function (options) {
    return socket.send({
      type: 'broadcast',
      name: options.name,
      channel: channel,
      payload: options.payload
    });
  };

  this.listen = function (options, callback) {
    if (!_this.listeners[options.name]) _this.listeners[options.name] = [];
    _this.listeners[options.name].push(callback);
    return function () {
      var index = _this.listeners[options.name].indexOf(callback);
      _this.listeners[options.name].slice(index, 1);
    };
  };

  this.request = function (options, payload) {
    var id = Math.random().toString(36).slice(2);
    var self = _this;
    if (channel == 'system') {
      options.device = {};
    }
    return new Promise(function (resolve, reject) {
      self.requests[id] = {
        resolve: resolve,
        reject: reject,
        timeout: setTimeout(function () {
          reject(new Error('timeout'));
          delete self.requests[id];
        }, 10000)
      };
      socket.send({
        type: 'request',
        id: id,
        target: options.device.uuid,
        name: options.name,
        channel: channel,
        payload: payload
      });
    });
  };

  this.respond = function (options, callback) {
    _this.responders[options.name] = callback;
    return function () {
      delete _this.responders[options.name];
    };
  };

  this.onBroadcast = function (message) {
    (_this.listeners[message.name] || []).forEach(function (callback) {
      callback(message.payload, message);
    });
  };

  this.onResponse = function (message) {
    var request = _this.requests[message.id];
    if (!request) return;
    clearTimeout(request.timeout);
    delete _this.requests[message.id];
    if (message.error) {
      request.reject(message.error);
    } else {
      request.resolve(message.payload);
    }
  };

  this.onRequest = function (message) {
    var self = _this;
    var response = {
      type: 'response',
      id: message.id
    };
    return Promise.resolve().then(function () {
      if (!self.responders[message.name]) {
        throw new Error('unhandled');
      }
      return self.responders[message.name](message.payload, message);
    }).then(function (payload) {
      response.payload = payload;
      socket.send(response);
    })['catch'](function (error) {
      response.error = error.message;
      socket.send(response);
    });
  };

  /* Message Routing */
  socket.events.on('message', function (message) {
    if (message.type === 'response') return self.onResponse(message);
    if (message.channel !== channel) return null;
    if (message.type === 'request') return self.onRequest(message);
    if (message.type === 'broadcast') return self.onBroadcast(message);
    return null;
  });
};

module.exports = {
  system: new Interface('system'),
  organization: new Interface('organization'),
  experience: new Interface('experience'),
  location: new Interface('location')
};