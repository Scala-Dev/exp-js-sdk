'use strict';

module.exports = class Channel {

  constructor (name, network, context) {
    this.name = name;
    this.network = network;
    this.context = context;
  }

  broadcast (name, payload) {}

  listen (name, callback) {}

  request (target, name, payload) {}

  respond (name, callback) {}

};
