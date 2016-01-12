'use strict';

const runtime = require('../runtime');
const Gateway = require('./Gateway');
const EventNode = require('../utils/EventNode');

class Network {

  constructor () {
    this.events = new EventNode();
    this.primary = new Gateway();
    this.primary.on('online', () => this.events.trigger('online'));
    this.primary.on('offline', () => this.events.trigger('offline'));
    runtime.on('update', auth => {
      if (runtime.enableEvents) return this.refresh(auth);
    });
  }

  refresh (auth) {
    this.primary.disconnect();
    if (!auth || !auth.network) return;
    const config = auth.networks.find(network => network.isPrimary);
    if (!config) return;
    this.primary.connect({
      networkUuid: config.uuid,
      token: auth.token,
      host: config.host
    });
  }

  getChannel (name, context) {
    return this.primary.getChannel(name, context);
  }

  on (name, callback, context) {
    return this.events.on(name, callback, context);
  }

}

module.exports = Network;
