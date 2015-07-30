'use strict';

const connection = require('./connection');

const requests = {};
const responders = {};
const listeners = {};


const Interface = function (channel) {

  this.broadcast = options => {
    return connection.send({
      type: 'broadcast',
      name: options.name,
      topic: options.topic,
      channel: channel,
      payload: options.payload
    });
  };

  this.listen = (options, callback) => {
    const key = JSON.stringify([options.name, options.topic, channel]);
    if(!this.listeners[key]) this.listeners[key] = [];
    listeners[key].push(callback);
    return () => { 
      listeners[key].splice(listeners[key].indexOf(callback), 1); 
    };
  };

  this.request = (options, payload) => {
    const id = Math.random().toString(36).slice(2);
    return new Promise((resolve, reject) => {
      requests[id] = {
        resolve: resolve,
        reject: reject,
        timeout: setTimeout(function () {
          reject(new Error('timeout'));
          delete requests[id];
        }, 10000)
      };
      connection.send({
        type: 'request',
        id: id,
        target: { deviceUuid: options.device.uuid },
        name: name,
        channel: channel,
        topic: options.topic,
        payload: payload
      });
    });
  };

  this.respond = (options, callback) => {
    const key = JSON.stringify([options.name, options.topic, channel]);
    responders[key] = callback;
    return () => { delete responders[key]; };
  };  
};

const onBroadcast = message => {
  const key = JSON.stringify([message.name, message.topic, message.channel]);
  if (!listeners[key]) return;
  listeners[key].forEach(callback => callback(message.payload, message));
};

const onResponse = message => {
  var request = requests[message.id];
  if (!request) return;
  clearTimeout(request.timeout);
  delete requests[message.id];
  if (message.error) {
    request.reject(message.error);
  } else {
    request.resolve(message.payload);
  }
};

const onRequest = message => {
  const key = JSON.stringify([message.name, message.topic, message.channel]);
  var responder = responders[key];
  if (!responder) responder = () => { throw new Error('unhandled'); };
  var response = {
    type: 'response',
    id: message.id
  };
  return Promise.resolve()
    .then(() => responder(message.payload, message))
    .then(payload => {
      response.payload = payload;
      connection.send(response);
    })
    .catch(error => {
      response.error = error.message;
      connection.send(response);
    });
};

/* Message Routing */
connection.events.on('message', message => {
  if (message.type === 'request') return onRequest(message);
  if (message.type === 'response') return onResponse(message);
  if (message.type === 'broadcast') return onBroadcast(message);
  return null;
});


module.exports = Interface;

