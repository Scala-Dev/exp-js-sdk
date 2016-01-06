'use strict';

class ChannelDelegate {

  constructor (channel, context) {
    this._channel = channel;
    this._context = context;
  }

  trigger (name, payload) {
    return this._channel.trigger(name, payload);
  }

  on (name, options, callback) {
    return this._channel.on(name, options, callback, this._context);
  }

}

module.exports = ChannelDelegate;