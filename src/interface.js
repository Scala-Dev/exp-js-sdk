'use strict';

const connection = require('./connection');

const requests = {};
const responders = {};
const listeners = {};

/**
 * A low level interface to the event bus.
 * @namespace scala.interface
 */

/**
 * Broadcast a message to all devices.
 * @name broadcast
 * @method
 * @memberof scala.interface
 * @param {object} options
 * @param {string} options.name The name of the message.
 * @param {string} options.scope The scope of the message
 * @param {*} options.payload The message payload.
 * @param {object} options.target Filters for message recipiants.
 * @param {string} options.target.device The target device uuid (can be *).
 * @returns {Promise} A promise indicating the state of the request to send the message.
 */
function broadcast(options) {
  return connection.send({
    name: options.name,
    scope: options.scope,
    target: options.target,
    payload: options.payload
  });
}

/**
 * Listen for broadcasts from other devices.
 * @name listen
 * @method
 * @memberof scala.interface
 * @param {object} options
 * @param {string} options.name The name of the message.
 * @param {string} options.scope The scope of the message.
 * @param {function} callback The method to call when a message with this name is received (payload, message).
 * @returns {function} A method that cancels the listener.
 */
const listen = (options, callback) => {
  const key = JSON.stringify([options.scope, options.name]);
  const id = Math.random().toString(36).slice(2);
  if(!listeners[key]) listeners[key] = {};
  listeners[key][id] = callback;
  return () => { delete listeners[key][id]; };
};
const onBroadcast = message => {
  const key = JSON.stringify([message.scope, message.name]);
  if (!listeners[key]) return;
  Object.keys(listeners[key]).forEach(id => listeners[key][id](message.payload, message));
};

/**
 * Send a request to a specific device.
 * @name request
 * @method
 * @memberof scala.interface
 * @param {object} options
 * @param {string} options.name The name of the request.
 * @param {string} options.scope The scope of the request.
 * @param {*} options.payload The request payload
 * @param {object} options.target Filters for message recipiants.
 * @param {string} options.target.device The target device uuid.
 * @returns {Promise} A promise that will resolve with the response payload.
 */
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
      id: id,
      target: options.target,
      scope: options.scope,
      name: options.name,
      type: 'request',
      payload: options.payload
    });
  });
};

/**
 * Set the responder for a named request.
 * @name listen
 * @method
 * @memberof scala.interface
 * @param {object} options
 * @param {string} options.name The name of the request
 * @param {string} options.scope The scope of the request
 * @param {function} callback The method to call when a request is received (can return a promise).
 */
function respond(options, callback) {
  const key = JSON.stringify([options.scope, options.name]);
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
  var responder = responders[name];
  if (!responder) responder = () => { throw new Error('unhandled'); };
  var response = {
    targets: {
      device: message.source.device
    },
    id: message.id,
    name: message.name,
    type: 'response'
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



function onMessage(message) {
  if (message.type === 'request') return onRequest(message);
  if (message.type === 'response') return onResponse(message);
  if (message.type === 'broadcast') return onBroadcast(message);
  return null;
}


connection.events.on('message', onMessage);

module.exports.request = request;
module.exports.respond = respond;
module.exports.listen = listen;
module.exports.broadcast = broadcast;
