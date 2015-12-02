'use strict';

const Interface = require('./Interface');
const EventNode = require('./EventNode');

class Channel extends Interface {

  constructor () {
    super();
    this._broadcastEvents = new EventNode();
  }

  receive (message) {
    if (message.type === 'broadcast') {
      this._broadcastEvents.trigger(message.name, message.payload);
    }
  }

  broadcast (name, payload) {
    this._events.trigger('broadcast', {
      type: 'broadcast',
      name: name,
      payload: payload
    });
  }

  get hasListeners () {
    return this._broadcastEvents.hasListeners;
  }

  listen (name, callback) {
    return this._broadcastEvents.on(name, callback);
  }

  clear () {
    this._broadcastEvents.clear();
    super.clear();
  }

}

module.exports = Channel;
