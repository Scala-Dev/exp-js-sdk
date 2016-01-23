'use strict';

const network = require('./network');
const config = require('./config');

class ChannelDelegate {

  constructor (name, options, context) {
    options = options || {};
    this.id = this.encode(name, options.system, options.consumer);
    this.context = context;
  }

  broadcast (name, payload, timeout) {
    return network.broadcast(name, this.id, payload, timeout);
  }

  listen (name, callback) {
    return network.listen(name, this.id, callback, this.context).then(() => this);
  }

  encode (name, system, consumer) {
    const s = JSON.stringify([config.auth.identity.organization, name, system ? 1 : 0, consumer ? 1 : 0]);
    if (typeof window === 'undefined') return(new Buffer(s)).toString('base64');
    else return btoa(s);
  }

}

module.exports = ChannelDelegate;