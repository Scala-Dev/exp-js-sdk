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
    runtime.on('update', config => this.refresh(config));
  }

  refresh (config) {
    this.primary.disconnect();
    this.primary.host = config.networks.primary.host;
    this.primary.token = config.token;
    this.primary.connect();
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
