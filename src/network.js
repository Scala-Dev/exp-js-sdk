'use strict';

const io = require('socket.io-client');
const Channel = require('./Channel');
const api = require('./api');
const runtime = require('./runtime');

const EventNode = require('event-node');


class Subscription {

  constructor () {
    this.promise = new Promise(resolve => { this.resolve = () => { this.status = true; resolve(); }});
    this.status = false;
  }

}



class Network extends EventNode {

  constructor () {
    super();
    this.socket = null;
    this.channels = {};
    this.subscriptions = {};
    this.promise = new Promise(resolve => this.resolve = resolve);
  }

  start () {
    runtime.on('update', () => this.connect());
  }

  connect () {
    this.disconnect();
    this.socket = io(runtime.auth.network.host, {
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity,
      query: `token=${ runtime.auth.token }`
    });
    this.socket.on('broadcast', message => this.onBroadcast(message));
    this.socket.on('channels', ids => this.onChannels(ids));
    this.socket.on('connect', () => this.onOnline());
    this.socket.on('subscribed', ids => this.onChannels(ids));
    this.socket.on('connect_error', () => this.onOffline());
    this.socket.on('error', error => this.onError(error));
  }

  disconnect () {
    if (!this.socket) return;
    this.socket.close();
    this.socket = null;
  }

  get isConnected () {
    return  this.socket ? this.socket.connected : false;
  }

  broadcast (name, channel, payload, timeout) {
    const message = { name: name, channel: channel, payload: payload };
    return api.post('/api/networks/current/broadcasts', { timeout: timeout }, message);
  }

  listen (name, channel, callback, context) {
    if (!this.channels[channel]) this.channels[channel] = new Channel(channel, this);
    if (!this.subscriptions[channel]) {
      this.subscriptions[channel] = new Subscription();
      this.socket.emit('subscribe', [channel]);
    }
    const listener = this.channels[channel].listen(name, callback, context);
    return this.subscriptions[channel].promise.then(() => listener);
  }

  respond (id, channel, payload) {
    return api.post('/api/networks/current/responses', null, { id: id, channel: channel, payload: payload });
  }

  sync () {
    if (!this.socket || !this.socket.isConnected) return;
    const subscribe = {};
    const unsubscribe = {};
    Object.keys(this.channels).then(id => {
      if (!this.channels[id].hasListeners) delete this.channels[id];
      else if (!this.subscriptions[id]) this.subscriptions[id] = new Subscription();
      subscribe[id] = true;
    });
    Object.keys(this.subscriptions).then(id => {
      if (this.channel[id]) {
        if (this.subscriptions.status) unsubscribe[id] = true;
        delete this.subscription[id];
      } else if (this.subscriptions[id].status) delete subscribe[id];
    });
    if (Object.keys(subscribe).length > 0) this.socket.emit('subscribe', Object.keys(subscribe));
    if (Object.keys(unsubscribe).length > 0) this.socket.emit('unsubscribe', Object.keys(unsubscribe));
  }

  onChannels (ids) {
    ids.forEach(id => {
      if (!this.subscriptions[id]) this.subscriptions[id] = new Subscription();
      this.subscriptions[id].resolve();
    });
    this.sync();
  }

  onSubscribed (ids) {
    ids.forEach(id => {
      if (!this.subscriptions[id]) this.subscriptions[id] = new Subscription();
      this.subscriptions[id].resolve();
    });
    this.sync();
  }

  onBroadcast (message) {
    if (!this.channels[message.channel]) return this.unsubscribe([message.channel]);
    this.channels[message.channel].receive(message);
  }

  onOnline () {
    this.trigger('online');
    this.socket.emit('channels');
  }

  onOffline () {
    this.trigger('offline');
  }

  onError (error) {
    this.trigger('error', error);
    setTimeout(() => this.connect(), 10000);
  }

}

module.exports = new Network();

