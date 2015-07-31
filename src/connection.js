'use strict';

/* Wrapper for socket connection/disconnection events and control. */

const utilities = require('./utilities');
const socket = require('./socket');

const events = new utilities.EventNode();

socket.events.on('online', () => {
  events.trigger('online');
});

socket.events.on('offline', () => {
  events.trigger('offline');
});

module.exports.on = events.on;





