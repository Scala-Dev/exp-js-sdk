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
      if (!socket) return null;
      log.trace('Sending message', { message: message });
      return socket.emit('message', message);
    });
};

/**
 * Initiate the connection to the server .
 * @memberof scala.connection
 * @method connect
 * @param {object} options 
 * @param {string} options.token The authorization token.
 * @param {string} options.host The host to connect to.
 * @returns {Promise}
*/
const connect = options => {
  options = options || {};
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
      socket = io(options.host || 'http://localhost:9000', {
        forceNew: true,
        query: 'token=' + (options.token || ''),
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 20000,
        timeout: 20000,
        reconnectionAttempts: Infinity
      });
      // Set up handler for incoming messages.
      socket.on('message', function (message) {
        log.trace('Receiving message', message);
        return events.trigger('message', message);
      });
      socket.on('connect', function () {
        log.debug('Connected');
        status_.isConnected = true;
        return events.trigger('online');
      });
      socket.on('error', function (error) {
        log.error(error);
      });
      socket.on('connect_error', function () {
        log.debug('Disconnected');
        status_.isConnected = false;
        return events.trigger('offline');
      });
    });
};

module.exports.connect = connect;
module.exports.send = send;
module.exports.events = events;
module.exports.status = status_;

