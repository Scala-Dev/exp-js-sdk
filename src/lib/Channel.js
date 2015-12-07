'use strict';

const EventNode = require('./EventNode');

class Proxy {

  constructor (channel, options, context) {
    this._channel = channel;
    this._options = options;
    this._context = context;
  }

  broadcast (name, payload) {
    return this._channel.broadcast(name, payload, this._options, this._context);
  }

  listen (name, callback) {
    return this._channel.listen(name, callback, this._options, this._context);
  }

}

class Channel {

  constructor (name, gateway) {
    this.name = name;
    this.gateway = gateway;
    this.systemListeners = new EventNode();
    this.userListeners = new EventNode();
  }

  receive (message) {
    if (message.type === 'broadcast') {
      if (message.system) {
        this.systemListeners.trigger(message.name, message.payload);
      } else {
        this.userListeners.trigger(message.name, message.payload);
      }
    }
  }

  broadcast (name, payload, options) {
    this.gateway.send({
      type: 'broadcast',
      channel: this.name,
      name: name,
      payload: payload,
      system: options.system
    });
  }

  getProxy (options, context) {
    return new Proxy(this, options, context);
  }

  listen (name, callback, options, context) {
    if (options.system) {
      return this.systemListeners.on(name, callback, context);
    } else {
      return this.userListeners.on(name, callback, context);
    }
  }

  clear (context) {
    this.userListeners.clear(context);
    this.systemListeners.clear(context);
  }

}


module.exports = Channel;
