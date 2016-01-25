'use strict';

const networkManager = require('./networkManager');
const authManager = require('./authManager');

class ChannelDelegate {

  constructor (name, options, context) {
    this.name = name;
    this.options = options || {};
    this.context = context;
  }

  broadcast (name, payload, timeout) {
    return this.generateId().then(id => {
      return networkManager.broadcast(name, id, payload, timeout);
    });
  }

  listen (name, callback) {
    return this.generateId().then(id => {
      return networkManager.listen(name, id, callback, this.context);
    });
  }

  generateId () {
    return authManager.get().then(auth => {
      const array = [auth.identity.organization, this.name, this.options.system ? 1 : 0, this.options.consumer ? 1: 0];
      const string = JSON.stringify(array);
      if (typeof window === 'undefined') return (new Buffer(string)).toString('base64');
      else return btoa(string);
    });
  }

}

module.exports = ChannelDelegate;