'use strict';

class ChannelDelegate {

  constructor (channel, options, context) {
    this._channel = channel;
    this._options = options;
    this._context = context;
  }

  broadcast (name, payload) {
    return this._channel.broadcast(name, payload, this._options, this._conext);
  }

  listen (name, callback) {
    return this._channel.listen(name, callback, this._options, this._context);
  }

}

module.exports = ChannelDelegate;