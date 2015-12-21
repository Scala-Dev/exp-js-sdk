'use strict';

const Network = require('./Network');

class Delegate {

  constructor (context) {
    this._context = context || Math.random();
  }

  on (name, callback) {
    return Network.on(name, callback, this._context);
  }

  clear (context) {
    return Network.clear(context || this._context);
  }

  getDelegate (context) {
    return new this.constructor(context);
  }

  getChannel (name, options) {
    return Network.getChannel(name, options, this._context);
  }

}

module.exports = Delegate;