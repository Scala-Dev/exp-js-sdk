'use strict';

const Runtime = require('./Runtime');

class Delegate {

  constructor (context) {
    this._context = context || Math.random();
  }

  start (options) {
    return Runtime.start(options);
  }

  getDelegate (context) {
    return new this.constructor(context);
  }

  clear (context) {
    return Runtime.clear(context || this._context);
  }

  on (name, callback) {
    return Runtime.on(name, callback, this._context);
  }

  stop () {
    return Runtime.stop();
  }

  get auth () {
    return Runtime.auth;
  }

  get enableEvents () {
    return Runtime._options ? Runtime._options !== false : true;
  }

}

module.exports = Delegate;
