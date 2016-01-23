'use strict';

const io = require('socket.io-client');
const _ = require('lodash');
const Channel = require('./Channel');
const events = require('./events');
const api = require('./api');

const defaults = {
  forceNew: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 20000,
  timeout: 20000,
  reconnectionAttempts: Infinity
};


class Network {

  constructor () {
    this.socket = null;
    this.channels = {};
    this.subscriptions = {};
    setInterval(() => this.sync(), 10000);
  }

  connect (host, token, options) {
    this.disconnect();
    options = _.merge(_.merge({}, defaults), options);
    options.query = `token=${ token }`;
    this.promise = new Promise((a, b) => { this.resolve = a; this.reject = b; });
    this.socket = io(host, options);
    this.socket.on('broadcast', message => this.onBroadcast(message));
    this.socket.on('channels', ids => this.onChannels(ids));
    this.socket.on('connect', () => this.onOnline());
    this.socket.on('subscribed', ids => this.onSubscribed(ids));
    this.socket.on('connect_error', () => this.onOffline());
    this.socket.on('error', error => this.onError(error));
    return this.promise;
  }

  disconnect () {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket = null;
    this.onOffline();
  }

  get isConnected () {
    return  this.socket ? this.socket.connected : false;
  }

  broadcast (name, channel, payload, timeout) {
    const message = { name: name, channel: channel, payload: payload };
    return api.post('/api/networks/current/broadcasts', { timeout: timeout }, message);
  }

  listen (name, channel, callback, context) {
    if (!this.subscriptions[channel]) this.subscribe([channel]);
    if (!this.channels[channel]) this.channels[channel] = new Channel(channel, this);
    this.channels[channel].listen(name, callback, context);
    return this.subscriptions[channel].promise;
  }

  respond (id, payload) {
    if (this.socket) this.socket.emit('response', { id: id, payload: payload });
  }

  sync () {
    const toSubscribe = [];
    const toUnsubscribe = [];
    Object.keys(this.channels).forEach(id => {
      if (!this.channels[id].hasListeners) delete this.channels[id];
      else if (!this.subscriptions[id]) toSubscribe.push(id);
    });
    Object.keys(this.subscriptions).forEach(id => {
      if (!this.channels[id]) toUnsubscribe.push(id);
    });
    if (toSubscribe.length > 0) this.subscribe(toSubscribe);
    if (toUnsubscribe.length > 0) this.unsubscribe(toUnsubscribe);
  }

  onChannels (ids) {
    this.subscriptions = {};
    ids.forEach(id => this.subscriptions[id] = true);
    this.sync();
  }

  onBroadcast (message) {
    if (!this.channels[message.channel]) return;
    this.channels[message.channel].receive(message);
  }

  onSubscribed (ids) {
    ids.forEach(id => {
      if (this.subscriptions[id]) this.subscriptions[id].resolve();
    });
  }

  onOnline () {
    events.trigger('online');
    this.socket.emit('subscriptions');
    this.resolve();
  }

  onOffline () {
    events.trigger('offline');
  }

  onError (error) {
    events.trigger('error', error);
    this.reject(error);
    this.disconnect();
  }

  unsubscribe (ids) {
    ids.forEach(id => delete this.subscriptions[id]);
    this.socket.emit('unsubscribe', ids);
  }

  subscribe (ids) {
    ids.forEach(id => {
      const subscription = {};
      subscription.promise = new Promise(a => subscription.resolve = a);
      this.subscriptions[id] = subscription;
    });
    this.socket.emit('subscribe', ids);
  }

}

module.exports = new Network();

