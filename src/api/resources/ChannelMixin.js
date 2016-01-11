'use strict';

class ChannelMixin {

  listen (name, callback, system) {
    return this.getChannel().listen(name, callback, system);
  }

  broadcast (name, payload, system) {
    return this.getChannel().broadcast(name, payload, system);
  }

  request (target, name, payload, system) {
    return this.getChannel().request(target, name, payload, system);
  }

  respond (name, options, callback, system) {
    return this.getChannel().respond(name, callback, system);
  }

  getChannel () {
    return this.network.getChannel(this.uuid);
  }

  fling (options) {
    return this.getChannel().broadcast('fling', options);
  }

}

module.exports = ChannelMixin;