'use strict';

const EventInterface = require('../lib/EventInterface');

class Component extends EventInterface {

  constructor (Proxy) {
    super();
    this.Proxy = Proxy;
    this.proxies = {};
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
