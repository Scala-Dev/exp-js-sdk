'use strict';

const runtime = require('../runtime');
const Gateway = require('./Gateway');
const EventNode = require('../utils/EventNode');

class Network {

  static getChannel (name, options, context) {
    return this._gateways.primary.getChannel(name, options, context);
  }

  static on (name, callback, context) {
    return this._events.on(name, callback, context);
  }

  static clear (context) {
    this._events.clear(context);
    Object.keys(this._gateways).forEach(key => {
      this._gateways[key].clear(context);
    });
  }

  static _initialize () {
    this._events = new EventNode();
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

}

Network._initialize();

module.exports = Network;