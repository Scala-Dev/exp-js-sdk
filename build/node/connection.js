'use strict';

/* Wrapper for socket connection/disconnection events and control. */

var utilities = require('./utilities');
var socket = require('./socket');

var events = new utilities.EventNode();

socket.events.on('online', function () {
  events.trigger('online');
});

socket.events.on('offline', function () {
  events.trigger('offline');
});

module.exports.on = events.on;