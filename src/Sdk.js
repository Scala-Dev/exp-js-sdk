'use strict';

const EventNode = require('./EventNode');
const Network = require('./Network');
const Runtime = require('./Runtime');
const Api = require('Api');


class Sdk {

  constructor () {
    this.network = new Network(this);
    this.runtime = null;
    this.events = new EventNode();
    this.api = new Api(this);
  }

  start (options) {
    if (this.runtime) this.runtime.stop();
    this.runtime = new Runtime(this);
    return this.runtime.start(options);
  }

  stop () {
    if (this.runtime) this.runtime.stop();
  }

}

module.exports = Sdk;