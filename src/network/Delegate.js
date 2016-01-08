'use strict';

class Delegate {

  constructor (network, context) {
    this.network = network;
    this.context = context;
  }

  on (name, callback) {
    return this.network.on(name, callback, this.context);
  }

  getChannel (name, options) {
    return this.network.getChannel(name, options || {}, this.context);
  }

  getDelegate (context) {
    return new this.constructor(this.network, context);
  }

}

module.exports = Delegate;