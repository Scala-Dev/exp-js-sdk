'use strict';

const EventNode = require('../utils/EventNode');


class Channel {

  constructor (name, gateway) {
    this._name = name;
    this._gateway = gateway;
    this._systemListeners = new EventNode();
    this._userListeners = new EventNode();
  }

  receive (message) {
    if (!message) return;
    if (message.system) {
      this._systemListeners.trigger(message.name, message.payload);
    } else {
      this._userListeners.trigger(message.name, message.payload);
    }
  }

  broadcast (name, payload, options) {
    this.send(name, payload, options);
  }

  send (name, payload, options) {
    options = options || {};
    this._gateway.send({
      channels: [this._name],
      name: name,
      payload: payload,
      system: options.system || false,
    });
  }

  listen (name, callback, options, context) {
    options = options || {};
    if (options.system) {
      return this._systemListeners.on(name, callback, context);
    } else {
      return this._userListeners.on(name, callback, context);
    }
  }

  clear (context) {
    this._userListeners.clear(context);
    this._systemListeners.clear(context);
  }

}


module.exports = Channel;
