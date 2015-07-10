'use strict';

/** 
 * Manages the Socket Connection to EXP
 * @namespace scala.connection
 * @property {object} status
 * @property {boolean} status.isConnected Whether or not the device has a socket connection to EXP servers.
 */

const io = require('socket.io-client');
const utilities = require('./utilities');

const log = new utilities.Logger({ name: 'Connection' });
var socket = null;

const status_ = {
  isConnected: false
};

/** 
 * Event Node (see {@link scala.utilities.EventNode})
 * @namespace scala.connection.events
 */
/**
 * The device is connected to EXP.
 * @memberof  scala.connection.events
 * @event online
 */
/**
 * The device is no longer connected to EXP servers.
 * @memberof  scala.connection.events
 * @event offline
 */
/**
 * A message was received from EXP servers.
 * @memberof  scala.connection.events
 * @event message
 * @private
 */
const events = new utilities.EventNode();

/**
 * Send a socket message to the server.
 * @memberof scala.connection
 * @method send
 * @param {object} message
 * @returns {Promise}
 */
const send = message => {
  return Promise.resolve()
    .then(() => {
      log.trace('Sending message', { message: message });
      return socket.emit('message', message);
    });
};

/**
 * Initiate the connection to the server .
 * @memberof scala.connection
 * @method connect
 * @param {string} token The authorization token.
 * @returns {Promise}
*/
const connect = token => {
  return Promise.resolve()
    .then(() => {
      // Close the connection if its currently open.
      if (socket) {
        status_.isConnected = false;
        socket.close();
        socket = null;
      }
    })
    .then(() => {
      // Establish the socket connection.
      socket = io('http://localhost:9000', {
        forceNew: true,
        query: 'token=' + token,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 20000,
        timeout: 20000,
        reconnectionAttempts: Infinity
      });
    })
    .then(() => {
      // Set up handler for incoming messages.
      socket.on('message', function (message) {
        log.trace('Receiving message', message);
        return events.trigger('message', message);
      });
    })
    .then(() => {
      // Set up promise resolutions on connect/error.
      return new Promise((resolve, reject) => {
        socket.on('connect', function () {
          log.debug('Connected');
          status_.isConnected = true;
          resolve();
          return events.trigger('online');
        });
        socket.on('connect_error', function () {
          log.debug('Disconnected');
          status_.isConnected = false;
          reject();
          return events.trigger('offline');
        });
      });
    });
};

module.exports.connect = connect;
module.exports.send = send;
module.exports.events = events;
module.exports.status = status_;

