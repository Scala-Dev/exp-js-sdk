'use strict';

const EventNode = require('./EventNode');

class Channel {

  constructor (gateway) {
    this.gateway = gateway;
    this.listenerNode = new EventNode();
  }

  receive (message) {
    if (message.type === 'broadcast') {
      this.listenerNode.trigger(message.name, message.payload);
    }
  }

  broadcast (name, payload) {
    this.gateway.send({
      type: 'broadcast',
      name: name,
      payload: payload
    });
  }

  getProxy (context) {
    return new Proxy(this, context);
  }

  listen (name, callback, context) {
    return this.listenerNode.on(name, callback, context);
  }

  clear (context) {
    return this.listenerNode.clear(context);
  }

}

class Proxy {

  constructor (channel, context) {
    this.channel = channel;
    this.context = context;
  }

  broadcast (name, payload) {
    return this._channel.broadcast(name, payload);
  }

  listen (name, callback) {
    return this._channel.listen(name, callback, this.context);
  }

}

module.exports = Channel;
