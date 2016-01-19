'use strict';


class Channel {

  constructor (name, sdk, context) {
    this.name = name;
    this.sdk = sdk;
    this.context = context;
  }

  getChannel () {
    return this.sdk.network.getChannel(this.name);
  }

  broadcast (name, payload, options) {
    options = options || {};
    return this.getChannel().broadcast({ name: name, channel: this.name, payload: payload, options: options });
  }

  listen (name, callback, options) {
    options = options || {};
    return this.getChannel().listen({ name: name, channel: this.name, callback: callback, options: options, context: this.context });
  }

  request (target, name, payload, options) {
    options = options || {};
    return this.getChannel().request({ target: target, channel: this.name, name: name, payload: payload, options: options });
  }

  respond (name, callback, options) {
    options = options || {};
    return this.getChannel().respond({ name: name, callback: callback, context: this.context, options: options });
  }

}


module.exports = Channel;