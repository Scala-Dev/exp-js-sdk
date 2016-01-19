'use strict';

const io = require('socket.io-client');
const _ = require('lodash');
const Channel = require('./Channel');

const defaults = {
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 20000,
  timeout: 20000,
  reconnectionAttempts: Infinity
};


class Network {

  constructor (sdk) {
    this.sdk = sdk;
    this.socket = null;
    this.channels = {};
  }

  get isConnected () {
    return  this.socket ? this.socket.connected : false;
  }

  disconnect () {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
  }

  connect (host, token, options) {
    this.disconnect();
    options = _.merge(_.merge({}, defaults), options);
    options.query = `token=${ token }`;
    this.promise = new Promise((a, b) => { this.resolve = a; this.reject = b; });
    this.socket = io(host, options);
    this.socket.on('message', message => this.onMessage(message));
    this.socket.on('connect', () => this.onOnline());
    this.socket.on('connect_error', () => this.onOffline());
    this.socket.on('error', error => this.onError(error));
    return this.promise;
  }

  onMessage (message) {
    if (!this.channels[message.channel]) return;
    this.channels[message.channel].receive(message);
  }

  onOnline () {
    this.sdk.events.trigger('online');
    this.resolve();
  }

  onOffline () {
    this.sdk.events.trigger('offline');
  }

  onError (error) {
    this.sdk.events.trigger('error', error);
    this.reject(error);
    this.disconnect();
  }

  getChannel (name) {
    if (!this.channels[name]) this.channels[name] = new Channel(name, this.sdk);
    return this.channels[name];
  }


}

module.exports = Network;

