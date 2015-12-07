'use strict';

const EventInterface = require('../lib/EventInterface');

class Component extends EventInterface {

  constructor (Delegate) {
    super();
    this.Delegate = Delegate;
    this.delegates = {};
  }

  clear (context) {
    super.clear(context);
  }

  getDelegate (context) {
    if (!this.delegates[context]) this.delegates[context] = new this.Delegate(this, context);
    return this.delegates[context];
  }

}

module.exports = Component;
