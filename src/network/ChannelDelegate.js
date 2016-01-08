'use strict';

class ChannelDelegate {

  constructor (channel, context) {
    this._channel = channel;
    this._context = context;
  }

  broadcast (name, payload, system) {
    this._channel.broadcast(name, payload, system);
  }

  listen (name, callback, system) {
    this._channel.listen(name, callback, system, this._context);
  }

  request (target, name, payload, system) {
    this._channel.request(target, name, payload, system);
  }

  respond (name, callback, system) {
    this._channel.respond(name, callback, system, this._context);
  }

}

module.exports = ChannelDelegate;