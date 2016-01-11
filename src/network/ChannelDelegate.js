'use strict';

class ChannelDelegate {

  constructor (channel, context) {
    this._channel = channel;
    this._context = context;
  }

  broadcast (name, payload) {
    this._channel.broadcast(name, payload);
  }

  listen (name, callback, system) {
    return this._channel.listen(name, callback, system, this._context);
  }

  request (target, name, payload) {
    return this._channel.request(target, name, payload);
  }

  respond (name, callback) {
    return this._channel.respond(name, callback, this._context);
  }

}

module.exports = ChannelDelegate;