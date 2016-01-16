'use strict';

const io = require('socket.io-client');

class Connection {

  constructor (sdk) {
    this.network = sdk.network;
    this.events = sdk.events;
  }

  start (options) {
    this.promise = new Promise((a, b) => { this.resolve = a; this.reject = b; });
    this.socket = io(options.host, {
      forceNew: true,
      query: `token=${ options.oken }`,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity
    });
    this.socket.on('message', message => this.network.receive(message));
    this.socket.on('connect', () => {
      this.events.trigger('online');
      this.resolve();
    });
    this.socket.on('connect_error', () => {
      this.events.trigger('offline');
    });
    this.socket.on('error', error => this.abort(error));
  }

  get isConnected () {
    return this.socket ? this.socket.connected : false;
  }

  abort (error) {
    this.events.trigger('error', error);
    this.reject(error);
    this.stop();
  }

  stop () {
    if (this.socket) this.socket.disconnect();
    this.events.trigger('offline');
    this.reject(new Error('Network stopped.'));
  }

}

module.exports = Connection;