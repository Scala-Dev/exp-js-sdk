'use strict';

const Component = require('../lib/Component');
const ComponentProxy = require('../lib/ComponentProxy');
const Gateway = require('../lib/Gateway');

const runtime = require('./runtime');

class Network extends Component {

  constructor (Proxy) {
    super(Proxy);
    this.auth = null;
    this.primary = new Gateway();
    this.primary.on('online', () => this.events.trigger('online'));
    this.primary.on('offline', () => this.events.trigger('offline'));
    runtime.on('update', config => this.refresh(config));
  }

  refresh (config) {
    console.log(config);
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

class Proxy extends ComponentProxy {

  getChannel (name, options) {
    options = options || {};
    return this._component.primary.getChannelProxy(name, options, this._context);
  }

}

module.exports = new Network(Proxy);
