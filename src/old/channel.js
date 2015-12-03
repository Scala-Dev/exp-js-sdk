'use strict';

module.exports = class Channel {

  constructor (name) {
    this.name = name;
    this._listeners = {};
  }

  broadcast () {
    throw new Error('Custom channel broadcasts not yet implemented.');
  }

  listen (name, callback) {
    if (!this._listeners[name]) this._listeners[name] = [];
    this._listeners[name].push(callback);
    return () => {
      this._listeners[name].splice(this._listeners[name].indexOf(callback), 1);
    };
  }

  request () {
    throw new Error('Custom channel requests not yet implemented.');
  }

  respond () {
    throw new Error('Custom channel responding not yet implemented.');
  }

  onMessageReceived (message) {
    if (message.type === 'broadcast') {
      this.onBroadcastReceived(message);
    }
  }

  onBroadcastReceived (message) {
    if (!this._listeners[message.name]) return;
    this._listeners[message.name].forEach(callback => {
      callback(message.payload, message);
    });
  }

};
