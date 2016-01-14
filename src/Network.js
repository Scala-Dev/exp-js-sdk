'use strict';

const io = require('socket.io-client');

class Network {

  constructor (sdk) {
    this.sdk = sdk;
    this.channels = {};
    this.socket = null;
  }

  disconnect () {
    if (this.socket) this.socket.disconnect();
    this.sdk.events.trigger('offline');
    this.status = false;
    this.socket = null;
  }

  connect (options) {
    this.disconnect();
    this.socket = io(options.host, {
      forceNew: true,
      query: `token=${ options.token }`,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity
    });
    this.socket.on('message', message => this.sdk.messages.trigger(message.channel, message));
    this.socket.on('connect', () => {
      this.status = true;
      this.sdk.events.trigger('online');
    });
    this.socket.on('connect_error', () => {
      this.sdk.events.trigger('offline');
      this.status = false;
    });
    this.socket.on('error', error => this.sdk.events.trigger('error', { error: error }));
  }

}

module.exports = Network;