'use strict';

const socket = require('./socket');

const Interface = function (channel) {

  const self = this;
  
  this.requests = {};
  this.responders = {};
  this.listeners = {};

  this.broadcast = options => {
    return socket.send({
      type: 'broadcast',
      name: options.name,
      channel: channel,
      payload: options.payload
    });
  };

  this.listen = (options, callback) => {
    if (!this.listeners[options.name]) this.listeners[options.name] = [];
    this.listeners[options.name].push(callback);
    return () => { 
      const index = this.listeners[options.name].indexOf(callback);
      this.listeners[options.name].slice(index, 1);
    };
  };

  this.request = (options, payload) => {
    const id = Math.random().toString(36).slice(2);
    const self = this;
    if (channel == 'system') {
      options.device = {};
    }
    return new Promise((resolve, reject) => {
      self.requests[id] = {
        resolve: resolve,
        reject: reject,
        timeout: setTimeout(() => {
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

  this.respond = (options, callback) => {
    this.responders[options.name] = callback;
    return () => { delete this.responders[options.name]; };
  };  


  this.onBroadcast = message => {
    (this.listeners[message.name] || []).forEach(callback => {
      callback(message.payload, message);
    });
  };

  this.onResponse = message => {
    var request = this.requests[message.id];
    if (!request) return;
    clearTimeout(request.timeout);
    delete this.requests[message.id];
    if (message.error) {
      request.reject(message.error);
    } else {
      request.resolve(message.payload);
    }
  };

  this.onRequest = message => {
    var self = this;
    var response = {
      type: 'response',
      id: message.id
    };
    return Promise.resolve()
      .then(() => {
        if (!self.responders[message.name]) { 
          throw new Error('unhandled');
        }
        return self.responders[message.name](message.payload, message);
      })
      .then(payload => {
        response.payload = payload;
        socket.send(response);
      })
      .catch(error => {
        response.error = error.message;
        socket.send(response);
      });
  };

  /* Message Routing */
  socket.events.on('message', message => {
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
