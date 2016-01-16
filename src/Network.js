'use strict';

const Channel = require('./Channel');
const Connection = require('./Connection');

class Network {

  constructor (sdk) {
    this.sdk = sdk;
    this.connection = null;
    this.channels = {};
  }

  get isConnected () {
    return  this.connection ? this.connection.isConnected : false;
  }

  receive (message) {
    if (this.channels[message.channel]) this.channels[message.channel].receive(message);
  }

  getChannel (name) {
    if (!this.channels[name]) this.channels[name] = new Channel(name, this.sdk);
    return this.channels[name];
  }

  disconnect () {
    if (!this.connection) return;
    this.connection.stop();
    this.connection = null;
  }

  connect (options) {
    this.disconnect();
    this.connection = new Connection(this, this.sdk.events);
    return this.connection.start(options);
  }

}

module.exports = Network;