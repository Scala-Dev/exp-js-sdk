'use strict';

const networkManager = require('./networkManager');
const authManager = require('./authManager');

class ChannelDelegate {

  constructor (id, context) {
    this.id = id;
    this.context = context;
  }

  broadcast (name, payload, timeout) {
    return networkManager.broadcast(name, this.id, payload, timeout);
  }

  listen (name, callback) {
    return networkManager.listen(name, this.id, callback, this.context);
  }

  static create (name, options, context) {
    return this.generateId(name, options || {}).then(id => new this(id, context));
  }

  static generateId (name, options) {
    return authManager.get().then(auth => {
      const array = [auth.identity.organization, name, options.system ? 1 : 0, options.consumer ? 1: 0];
      const string = JSON.stringify(array);
      if (typeof window === 'undefined') return (new Buffer(string)).toString('base64');
      else return btoa(string);
    });

  }

}

module.exports = ChannelDelegate;