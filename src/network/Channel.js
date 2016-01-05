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

  trigger (name, payload) {
    this.send(name, payload);
  }

  broadcast (name, payload) {
    this.send(name, payload);
  }

  on (name, callback, options, context) {
    this.listen(name, callback, options, context);
  }

  send (name, payload) {
    this._gateway.send({
      channels: [this._name],
      name: name,
      payload: payload
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
