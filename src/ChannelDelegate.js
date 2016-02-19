'use strict';
/* jshint -W074 */

const network = require('./network');
const runtime = require('./runtime');

class ChannelDelegate {

  static create (name, options, context) {
    options = options || {};
    let id;
    if (!runtime.auth) throw new Error('Not authenticated.');
    const array = [runtime.auth.identity.organization, name, (options.system ? 1 : 0), (options.consumer ? 1: 0)];
    const string = JSON.stringify(array);
    if (typeof window === 'undefined') id (new Buffer(string)).toString('base64');
    else id = btoa(string);
    return new this(id, context);
  }

  constructor (id, context) {
    this.id = id;
    this.context = context;
  }

  broadcast (name, payload, timeout) {
    return network.broadcast(name, this.id, payload, timeout);
  }

  listen (name, callback) {
    return network.listen(name, this.id, callback, this.context);
  }

}

module.exports = ChannelDelegate;