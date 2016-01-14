'use strict';

const Network = require('./Network');
//const Api = require('./Api');
const Runtime = require('./Runtime');
const EventNode = require('./EventNode');

class Sdk {

  constructor () {
    //this.api = new Api(this);
    this.runtime = new Runtime(this);
    this.network = new Network(this);
    this.events = new EventNode();
    this.messages = new EventNode();
    this.EventNode = EventNode;
  }

}

module.exports = Sdk;