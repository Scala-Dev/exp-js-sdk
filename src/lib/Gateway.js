'use strict';

const io = require('socket.io-client');

const Channel = require('./Channel');
const EventInterface = require('./EventInterface');


class Gateway extends EventInterface {

  constructor (options) {
    super();
    this.channels = [];
    this.host = options.host;
    this.token = options.token;
    this.connect();
  }

  getChannelProxy (name, context) {
    if (!this.channels[name]) this.channels[name] = new Channel(this);
    return this.channels[name].getProxy(context);
  }

  clear (context) {
    this.channels.forEach(channel => channel.clear(context));
    this.socket.close();
  }

  connect () {
    if (this.socket) this.socket.diconnect();
    this.socket = io(this.host, {
      forceNew: true,
      query: 'token=' + (this.token || ''),
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
    if (!message) return;
    if (!this.channels[message.name]) return;
    this.channels[message.name].receive(message);
  }

  send (message) {
    return this.socket.emit('message', message);
  }

}


module.exports = Gateway;
