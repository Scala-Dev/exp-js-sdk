'use strict';
/* jshint -W074 */


const io = require('socket.io-client');

const EventNode = require('event-node');


class Subscription {

  constructor () {
    this._status = false;
    this._promise = new Promise(resolve => this._resolve = resolve);
    this.reset();
  }

  reset () {
    if (!this._status) return;
    this._status = false;
    this._promise = new Promise(resolve => this._resolve = resolve);
  }

  resolve () {
    this._resolve();
    this._status = true;
  }

  wait () {
    return this._promise;
  }

}

class Channel {

  constructor (id, network) {
    this._id = id;
    this._network = network;
    this._events = new EventNode();
  }

  listen (name, callback, context) {
    return this._events.on(name, (payload, message) => {
      callback(payload, response => {
        return Promise.resolve().then(() => response).then(response => {
          return this._network.respond(message.id, message.channel, response);
        });
      });
    }, context);
  }

  receive (message) {
    this._events.trigger(message.name, message.payload, message);
  }

  get hasListeners () {
    return this._events.hasListeners;
  }

}


class ChannelDelegate {

  constructor (name, options, sdk, context) {
    this._name = name || 'default';
    this._options = options || {};
    this._sdk = sdk;
    this._context = context;
    this._id = null;
  }

  broadcast (name, payload, timeout) {
    return this._generateId().then(id => {
      return this._sdk.network.broadcast(name, id, payload, timeout);
    });
  }

  listen (name, callback) {
    return this._generateId().then(id => {
      return this._sdk.network.listen(name, id, callback, this._context);
    });
  }

  fling (payload, timeout) {
    return this.broadcast('fling', payload, timeout);
  }

  _generateId () {
    if (this._id) return Promise.resolve(this._id);
    return this._sdk.authenticator.getAuth().then(auth => {
      const array = [auth.identity.organization, this._name, (this._options.system ? 1 : 0), (this._options.consumer ? 1: 0)];
      const string = JSON.stringify(array);
      if (typeof window === 'undefined') this._id = (new Buffer(string)).toString('base64');
      else this._id = btoa(string);
      return this._id;
    });

  }

}



class Network {

  constructor (sdk) {
    this._sdk = sdk;
    this._status = true;
    this._socket = null;
    this._events = new EventNode();
    this._channels = {};
    this._subscriptions = {};
    this._listener = null;
  }

  start () {
    this._listener = this._sdk.authenticator.on('update', auth => this._connect(auth));
  }

  stop () {
    if (this._listener) this._listener.cancel();
    this._listener = null;
    this._disconnect();
  }

  on (name, callback, context) {
    return this._events.on(name, callback, context);
  }

  getChannel (name, options, context) {
    return new ChannelDelegate(name, options, this._sdk, context);
  }

  _connect (auth) {
    this._disconnect();
    if (!this._status) return;
    if (!this._sdk.options.enableNetwork) return;
    const socket = io(auth.network.host, {
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 20000,
      timeout: 20000,
      reconnectionAttempts: Infinity,
      query: `token=${ auth.token }`
    });
    this._socket = socket;
    this._socket.on('broadcast', message => { if (socket === this._socket) this._onBroadcast(message); });
    this._socket.on('connect', () => { if (socket === this._socket) this._onOnline(); });
    this._socket.on('subscribed', ids => { if (socket === this._socket) this._onSubscribed(ids); });
    this._socket.on('connect_error', () => { if (socket === this._socket) this._onOffline(); });
  }

  _disconnect () {
    if (!this._socket) return;
    this._socket.close();
    this._socket = null;
    this._events.trigger('offline');
  }

  broadcast (name, channel, payload, timeout) {
    const message = { name: name, channel: channel, payload: payload };
    return this._sdk.api.post('/api/networks/current/broadcasts', message, { timeout: timeout });
  }

  respond (id, channel, payload) {
    const message = { id: id, channel: channel, payload: payload };
    return this._sdk.api.post('/api/networks/current/responses', message);
  }

  get isConnected () {
    return  this._socket ? this._socket.connected : false;
  }

  _emit (name, payload) {
    if (!this._socket || !this._socket.connected) return;
    this._socket.emit(name, payload);
  }



  listen (name, channel, callback, context) {
    if (!this._channels[channel]) this._channels[channel] = new Channel(channel, this);
    const listener = this._channels[channel].listen(name, callback, context);
    if (!this._subscriptions[channel]) {
      this._subscriptions[channel] = new Subscription();
      this._emit('subscribe', [channel]);
    }
    return this._subscriptions[channel].wait().then(() => listener);
  }


  _onSubscribed (ids) {
    ids.forEach(id => {
      if (!this._subscriptions[id]) this._subscriptions[id] = new Subscription();
      this._subscriptions[id].resolve();
    });
  }

  _onBroadcast (message) {
    if (!this._channels[message.channel]) return;
    this._channels[message.channel].receive(message);
  }

  _onOnline () {
    Object.keys(this._subscriptions).forEach(id => {
      this._subscriptions[id].reset();
      if (!this._channels[id] || !this._channels[id].hasListeners) {
        delete this._subscriptions[id];
      }
    });
    this._emit('subscribe', Object.keys(this._subscriptions));
    this._events.trigger('online');
  }

  _onOffline () {
    Object.keys(this._subscriptions).forEach(id => this._subscriptions[id].reset());
    this._events.trigger('offline');
  }

}

module.exports = Network;

