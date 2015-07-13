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
 * @param {*} options.payload The message payload.
 * @returns {Promise} A promise indicating the state of the request to send the message.
 */
function broadcast(options) {
  return connection.send({
    name: options.name,
    type: 'broadcast',
    targets: ['*'],
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
 * @param {function} callback The method to call when a message with this name is received (payload, message).
 * @returns {function} A method that cancels the listener.
 */
function listen(options, callback) {
  if(!listeners[options.name]) listeners[options.name] = [];
  listeners[options.name].push(callback);
  return () => {
    listeners[options.name].splice(listeners[options.name].indexOf(callback), 1);
  };
}


function onBroadcast(message) {
  if (!listeners[message.name]) return;
  listeners[message.name].forEach(callback => callback(message.payload, message));
}

/**
 * Send a request to a specific device.
 * @name request
 * @method
 * @memberof scala.interface
 * @param {object} options
 * @param {string} options.name The name of the request.
 * @param {string} options.target The target device's UUID.
 * @param {*} options.payload The request payload
 * @returns {Promise} A promise that will resolve with the response payload.
 */
function request(options) {
  const id = Math.random().toString(36).substr(2);
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
      targets: [options.target],
      name: options.name,
      type: 'request',
      payload: options.payload
    });
  });
}

/**
 * Set the responder for a named request.
 * @name listen
 * @method
 * @memberof scala.interface
 * @param {object} options
 * @param {string} options.name The name of the request
 * @param {function} callback The method to call when a request is received (can return a promise).
 */
function respond(options, callback) {
  responders[options.name] = callback;
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
    targets: [message.source],
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
