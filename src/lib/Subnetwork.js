'use strict';

const io = require('socket.io-client');

const Channel = require('./Channel');
const Interface = require('./Interface');


class ChannelInterface {

  constructor (name, context) {
    this.name = name;
    this.context = context;
    this.channel = new Channel();
  }

}


class Subnetwork extends Interface {

  constructor (options) {
    this._host = options.host;
    this._token = options.token;
    this._ifaces = [];
    this._connect();
  }

  getChannel (name, context) {
    return this._getChannelInterface(name, context).channel;
  }

  setHost (host) {
    this._host = host;
    this._connect();
  }

  setToken (token) {
    this._token = token;
    this._connect();
  }

  clear () {
    this._ifaces.forEach(iface => iface.channel.clear());
    this._ifaces = [];
    this._socket.close();
    super.clear();
  }

  clearContext (context) {
    this._ifaces = this._ifaces.filter(iface => {
      if (iface.context !== context) return true;
      iface.channel.clear();
      return false;
    });
  }

  _connect () {
    if (this._socket) this._socket.diconnect();
    this._socket = io(this.host, {
      forceNew: true,
      query: 'token=' + (this.token || ''),
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity
    });
    this._socket.on('message', message => {
      this._receive(message);
      this._events.trigger('message', message);
    });
    this._socket.on('connect', () => {
      this._events.trigger('online');
    });
    this._socket.on('connect_error', () =>{
      this._events.trigger('offline');
    });
    this._socket.on('error', error => {
      this._events.trigger('error', error);
    });
  }

  _getChannelInterface (name, context) {
    let iface = this._findChannelInterface(name, context);
    if (!iface) iface = this._createChannelInterface(name, context);
    return iface;
  }

  _findChannelInterface (name, context) {
    return this._ifaces.find(iface => {
      return iface.name === name && iface.context === context;
    });
  }

  _createChannelInterface (name, context) {
    let iface = new ChannelInterface(name, context);
    this._ifaces.push(iface);
    iface.channel.on('message', message => {
      message.channel = name;
      this._send(message);
    });
    return iface;
  }

  _forward (message) {
    if (!message.channel) return null;
    const ifaces = this.ifaces.filter(ifaces => ifaces.name === message.channel);
    return ifaces.forEach(iface => iface.channel.receive(message));
  }

  _receive (message) {
    if (!message) return null;
    this._forward(message);
    return null;
  }

  _send (message) {
    return this.socket.emit('message', message);
  }

}


module.exports = Subnetwork;
