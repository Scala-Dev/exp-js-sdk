'use strict';

const io = require('socket.io-client');

const Channel = require('./Channel');

const EventNode = require('../utils/EventNode');

class Gateway {

  constructor () {
    this.channels = {};
    this.events = new EventNode();
    this.socket = null;
  }

  getChannel (name, context) {
    if (!this.channels[name]) this.channels[name] = new Channel(name, this);
    return this.channels[name].getDelegate(context);
  }

  on (name, callback, context) {
    this.events.on(name, callback, context);
  }

  send (message) {
    if (!this.socket) return;
    this.socket.emit('message', message);
  }

  disconnect () {
    if (this.socket) this.socket.disconnect();
    this.socket = null;
  }

  connect (options) {
    this.disconnect();
    this.socket = io(options.host, {
      forceNew: true,
      query: `token=${ options.token || ''}&networkUuid=${ options.networkUuid }`,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity
    });
    this.socket.on('message', message => {
      this.receive(message);
    });
    this.socket.on('connect', () => {
      this.events.trigger('online');
    });
    this.socket.on('connect_error', () =>{
      this.events.trigger('offline');
    });
    this.socket.on('error', error => {
      this.events.trigger('error', error);
    });
  }

  receive (message) {
    if (typeof message !== 'object') return;
    const channel = this.channels[message.channel];
    if (channel) channel.receive(message);
  }

}


module.exports = Gateway;