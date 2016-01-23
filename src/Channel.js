'use strict';

const EventNode = require('./EventNode');

class Channel {

  constructor (id, network) {
    this.id = id;
    this.network = network;
    this.events = new EventNode();
  }

  listen (name, callback, context) {
    return this.events.on(name, (payload, message) => {
      callback(payload, response => {
        this.network.respond(message.id, response);
      });
    }, context);
  }

  get hasListeners () {
    return this.events.hasListeners;
  }

  receive (message) {
    this.events.trigger(message.name, message.payload, message);
  }

}

module.exports = Channel;
