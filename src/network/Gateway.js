'use strict';

const io = require('socket.io-client');

const Channel = require('./Channel');
const ChannelDelegate = require('./ChannelDelegate');

const EventNode = require('../utils/EventNode');


class Gateway {

  constructor () {
    this._channels = {};
  }

  getChannelDelegate (name, options, context) {
    if (!this._channels[name]) this._channels[name] = new Channel(name, this);
    const channel = this._channels[name];
    return new ChannelDelegate(channel, options, context);
  }

  clear (context) {
    this._disconnect();
    Object.keys(this._channels).forEach(name => this._channels[name].clear(context));
  }

  on (name, callback, context) {
    this.constructor._events.on(name, callback, context);
  }

  send (message) {
    if (!this._socket) return;
    return this._socket.emit('message', message);
  }

  _disconnect () {
    if (this._socket) this._socket.disconnect();
    this._socket = null;
  }

  static _initialize () {
    this._events = new EventNode();
  }

  _connect (options) {
    this._disconnect();
    this._socket = io(options.url, {
      forceNew: true,
      query: `token=${ options.token || ''}&networkUuid=${ options.networkUuid }`,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity
    });
    this._socket.on('message', message => {
      this._receive(message);
    });
    this._socket.on('connect', () => {
      this.constructor._events.trigger('online');
    });
    this._socket.on('connect_error', () =>{
      this.constructor._events.trigger('offline');
    });
    this._socket.on('error', error => {
      this.constructor._events.trigger('error', error);
    });
  }

  _receive (message) {
    if (!message) return;
    message.channels.forEach(name => {
      if (!this._channels[name]) return;
      this._channels[name].receive(message);
    });
  }

}

Gateway._initialize();

module.exports = Gateway;