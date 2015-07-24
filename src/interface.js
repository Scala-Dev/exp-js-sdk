'use strict';

const connection = require('./connection');

const requests = {};
const responders = {};
const listeners = {};

/* Broadcast-Listen Pattern */

const broadcast = options => {
  return connection.send({
    type: 'broadcast',
    target: options.target,
    name: options.name,
    topic: options.topic || 'default',
    scope: options.scope || 'default',
    payload: options.payload
  });
};

const listen = (options, callback) => {
  const key = JSON.stringify([options.scope, options.topic, options.name]);
  const id = Math.random().toString(36).slice(2);
  if(!listeners[key]) listeners[key] = {};
  listeners[key][id] = callback;
  return () => { delete listeners[key][id]; };
};

const onBroadcast = message => {
  const key = JSON.stringify([message.scope, message.topic, message.name]);
  if (!listeners[key]) return;
  Object.keys(listeners[key]).forEach(id => listeners[key][id](message.payload, message));
};

/* Request-Response Pattern */

const request = options => {
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
      target: options.target,
      name: options.name,
      topic: options.topic,
      scope: options.scope,
      payload: options.payload
    });
  });
};

function respond(options, callback) {
  const key = JSON.stringify([options.scope, options.topic, options.name]);
  responders[key] = callback;
}

function onResponse(message) {
  var request = requests[message.id];
  if (!request) return;
  clearTimeout(request.timeout);
  delete requests[message.id];
  if (message.error) {
    request.reject(message.error);
  } else {
    request.resolve(message.payload);
  }
}

function onRequest(message) {
  const key = JSON.stringify([message.scope, message.topic, message.name]);
  var responder = responders[key];
  if (!responder) responder = () => { throw new Error('unhandled'); };
  var response = {
    type: 'response',
    id: message.id,
    target: message.source,
    name: message.name,
    topic: message.topic,
    scope: message.scope
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
}

/* Message Routing */
connection.events.on('message', message => {
  if (message.type === 'request') return onRequest(message);
  if (message.type === 'response') return onResponse(message);
  if (message.type === 'broadcast') return onBroadcast(message);
  return null;
});


module.exports.request = request;
module.exports.respond = respond;
module.exports.listen = listen;
module.exports.broadcast = broadcast;
