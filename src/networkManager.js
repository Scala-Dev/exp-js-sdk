'use strict';

const io = require('socket.io-client');
const Channel = require('./Channel');
const api = require('./api');

const EventNode = require('./EventNode');

const authManager = require('./authManager');


class NetworkManager extends EventNode {

  constructor () {
    super();
    this.started = false;
    this.socket = null;
    this.channels = {};
    this.subscriptions = {};
    this.promise = new Promise(resolve => this.resolve = resolve);
    setInterval(() => this.sync(), 10000);
  }

  start () {
    if (this.started) throw new Error('Network manager already started.');
    this.started = true;
    this.trigger('start');
    this.listener = authManager.on('update', () => this.refresh());
    this.refresh();
    return this.promise;
  }

  stop () {
    if (!this.started) return;
    this.trigger('stop');
    this.listener.cancel();
    this.disconnect();
  }

  refresh () {
    authManager.get().then(auth => this.connect(auth));
  }

  connect (auth) {
    this.disconnect();
    this.socket = io(auth.network.host, {
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity,
      query: `token=${ auth.token }`
    });
    this.socket.on('broadcast', message => this.onBroadcast(message));
    this.socket.on('channels', ids => this.onChannels(ids));
    this.socket.on('connect', () => this.onOnline());
    this.socket.on('subscribed', ids => this.onSubscribed(ids));
    this.socket.on('connect_error', () => this.onOffline());
    this.socket.on('error', error => this.onError(error));
  }

  disconnect () {
    if (!this.socket) return;
    this.socket.disconnect();
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
    if (!this.subscriptions[channel]) this.subscribe([channel]);
    if (!this.channels[channel]) this.channels[channel] = new Channel(channel, this);
    const listener = this.channels[channel].listen(name, callback, context);
    return this.subscriptions[channel].promise.then(() => listener);
  }

  respond (id, channel, payload) {
    return api.post('/api/networks/current/responses', null, { id: id, channel: channel, payload: payload });
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
    const old = this.subscriptions;
    this.subscriptions = {};
    ids.forEach(id => {
      if (old[id]) old[id].resolve();
      this.subscriptions[id] = {};
      this.subscriptions[id].promise = new Promise(a => this.subscriptions[id].resolve = a);
    });
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
    this.trigger('online');
    this.socket.emit('channels');
    this.resolve();
  }

  onOffline () {
    this.trigger('offline');
  }

  onError (error) {
    this.trigger('error', error);
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

module.exports = new NetworkManager();

