'use strict';

const io = require('socket.io-client');

const Channel = require('./Channel');
const EventNode = require('./EventNode');

const events = new EventNode();

class Gateway {

  constructor () {
    this.channels = {};
  }

  getChannel (name) {
    if (!this.channels[name]) this.channels[name] = new Channel(name, this);
    return this.channels[name];
  }

  clear (context) {
    this.disconnect();
    Object.keys(this.channels).forEach(name => this.channels[name].clear(context));
  }

  disconnect () {
    if (this.socket) this.socket.disconnect();
    this.socket = null;
  }

  on (name, callback, context) {
    events.on(name, callback, context);
  }

  connect (options) {
    console.log('options', options);
    this.disconnect();
    console.log('SOMEONE CALLED ME!');
    this.socket = io(options.url, {
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
      events.trigger('online');
    });
    this.socket.on('connect_error', () =>{
      events.trigger('offline');
    });
    this.socket.on('error', error => {
      events.trigger('error', error);
    });
  }

  receive (message) {
    if (!message) return;
    message.channels.forEach(name => {
      if (!this.channels[name]) return;
      this.channels[name].receive(message);
    });
  }

  send (message) {
    if (!this.socket) return;
    return this.socket.emit('message', message);
  }

}

module.exports = Gateway;