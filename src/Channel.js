'use strict';

const EventNode = require('event-node');

class Channel extends EventNode {

  constructor (id, network) {
    super();
    this.id = id;
    this.network = network;
  }

  listen (name, callback, context) {
    return this.on(name, (payload, message) => {
      callback(payload, response => {
        return Promise.resolve().then(() => response).then(() => {
          return this.network.respond(message.id, message.channel, response);
        });
      });
    }, context);
  }

  get hasListeners () {
    return Object.keys(this.namespaces).length > 0;
  }

  receive (message) {
    this.trigger(message.name, message.payload, message);
  }

}

module.exports = Channel;
