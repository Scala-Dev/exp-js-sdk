'use strict';

const EventNode = require('./EventNode');

class Interface {

  constructor () {
    this._events = new EventNode();
  }

  on () {
    this._events.on.apply(this._events, arguments);
  }

  clear () {
    this._events.clear();
  }

}


module.exports = Interface;
