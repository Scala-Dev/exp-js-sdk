'use strict';

const Component = require('../utils/Component');
const ComponentDelegate = require('../utils/ComponentDelegate');
const Gateway = require('../utils/Gateway');

const runtime = require('./runtime');

class Network extends Component {

  constructor (Delegate) {
    super(Delegate);
    this.auth = null;
    this.primary = new Gateway();
    this.primary.on('online', () => this.events.trigger('online'));
    this.primary.on('offline', () => this.events.trigger('offline'));
    runtime.on('update', auth => this.refresh(auth));
  }

  refresh (auth) {
    this.primary.disconnect();
    auth.networks.forEach(network => {
      if (!network.isPrimary) return;
      this.primary.url = network.url;
      this.primary.uuid = network.uuid;
      this.primary.token = auth.token;
      this.primary.connect();
    });

  }

  clear (context) {
    super.clear(context);
    this.primary.clear(context);
  }

}

class Delegate extends ComponentDelegate {

  getChannel (name, options) {
    options = options || {};
    return this._component.primary.getChannelDelegate(name, options, this._context);
  }

}

module.exports = new Network(Delegate);
