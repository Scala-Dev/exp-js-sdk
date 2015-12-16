'use strict';

const EventNode = require('./EventNode');

class EventInterface {

  constructor () {
    this.events = new EventNode();
  }

  on (name, callback, context) {
    return this.events.on(name, callback, context);
  }

  clear (context) {
    this.events.clear(context);
  }

}


module.exports = EventInterface;
