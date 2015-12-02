'use strict';

const EventInterface = require('../lib/EventInterface');

class Component extends EventInterface {

  constructor (Proxy) {
    this.Proxy = Proxy;
    this.proxies = {};
    super();
  }

  clear (context) {
    super.clear(context);
  }

  getProxy (context) {
    if (!this.proxies[context]) this.proxies[context] = new this.Proxy(this, context);
    return this.proxies[context];
  }

}

module.exports = Component;
