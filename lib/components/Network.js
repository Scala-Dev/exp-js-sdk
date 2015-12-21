'use strict';

const Gateway = require('../utils/Gateway');
const Runtime = require('./Runtime');
const EventNode = require('../utils/EventNode');
const runtime = Runtime.getDelegate();


class Network {

  static initialize (Delegate) {
    this._events = new EventNode();
    this._Delegate = Delegate;
    this._gateways = {};
    this._gateways.primary = new Gateway();
    this._gateways.primary.on('online', () => this._events.trigger('online'));
    this._gateways.primary.on('offline', () => this._events.trigger('offline'));
    runtime.on('update', auth => this._refresh(auth));
  }

  static _refresh (auth) {
    this._gateways.primary.disconnect();
    const network = auth.networks.find(network => network.isPrimary);
    if (!network) return;
    this._gateways.primary.connect({
      networkUuid: network.uuid,
      token: auth.token,
      url: network.url
    });
  }

  static getChannel (name, options, context) {
    const channel = this._gateways.primary.getChannel(name);
    return channel.getDelegate(options, context);
  }

  static on (name, callback, context) {
    return this._events.on(name, callback, context);
  }

  static clear (context) {
    this.events.clear(context);
    Object.keys(this._gateways).forEach(key => {
      this._gateways[key].clear(context);
    });
  }

  static getDelegate (context) {
    return new this._Delegate(context || Math.random());
  }

}

class Delegate {

  constructor (context) {
    this._context = context;
  }

  on (name, callback) {
    return Network.on(name, callback, this._context);
  }

  getChannel (name, options) {
    return Network.getChannel(name, options, this._context);
  }

}

Network.initialize(Delegate);

module.exports = Network;