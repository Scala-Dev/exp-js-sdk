'use strict';

const io = require('socket.io-client');
const Channel = require('./Channel');
const api = require('./api');
const runtime = require('./runtime');

const EventNode = require('event-node');


class ActiveSubscription {}

class PendingSubscription {
  constructor () {
    this.promise = new Promise(resolve => this.resolve = resolve);
  }
}



class Network extends EventNode {

  constructor () {
    super();
    this.socket = null;
    this.channels = {};
    this.activeSubscriptions = {};
    this.pendingSubscriptions = {};
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
    this.socket.on('channels', ids => { this.onChannels(ids); this.sync(); });
    this.socket.on('connect', () => this.onOnline());
    this.socket.on('subscribed', ids => { this.onSubscribed(ids); this.sync(); });
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
    let promise = Promise.resolve();
    if (!this.channels[channel]) this.channels[channel] = new Channel(channel, this);
    const listener = this.channels[channel].listen(name, callback, context);
    if (!this.activeSubscriptions[channel]) {
      if (!this.pendingSubscriptions[channel]) this.pendingSubscriptions[channel] = new PendingSubscription();
      promise = this.pendingSubscriptions[channel].promise;
    }
    this.sync();
    return promise.then(() => listener);
  }

  respond (id, channel, payload) {
    return api.post('/api/networks/current/responses', null, { id: id, channel: channel, payload: payload });
  }

  sync () {
    if (!this.socket || !this.socket.connected) return;
    const subscribe = Object.keys(this.channels).filter(id => {
      if (!this.channels[id].hasListeners) delete this.channels[id];
      else if (this.activeSubscriptions[id]) return;
      else if (!this.pendingSubscriptions[id]) this.pendingSubscriptions[id] = new PendingSubscription();
      return true;
    });
    const unsubscribe = Object.keys(this.activeSubscriptions).filter(id => {
      if (!this.channels[id]) {
        delete this.activeSubscriptions[id];
        return true;
      }
    });
    if (subscribe.length > 0) this.socket.emit('subscribe', subscribe);
    if (unsubscribe.length > 0) this.socket.emit('unsubscribe', unsubscribe);
  }

  onChannels (ids) {
    this.onSubscribed(ids);
    const map = {};
    ids.forEach(id => map[id] = true);

    // Remove subscriptions that are no longer active.
    Object.keys(this.activeSubscriptions).forEach(id => {
      if (!map[id]) delete this.activeSubscriptions[id];
    });

  }


  onSubscribed (ids) {
    // Resolve pending subscriptions.
    ids.forEach(id => {
      if (!this.activeSubscriptions[id]) this.activeSubscriptions[id] = new ActiveSubscription();
      if (this.pendingSubscriptions[id]) {
        this.pendingSubscriptions[id].resolve();
        delete this.pendingSubscriptions[id];
      }
    });
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

