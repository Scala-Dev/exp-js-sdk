'use strict';

const EventNode = require('./EventNode');
const Network = require('./Network');
const Runtime = require('./Runtime');
const Api = require('./Api');
const resources = require('./resources');


class Sdk {

  constructor () {
    this.network = new Network(this);
    this.runtime = new Runtime(this);
    this.api = new Api(this);
    this.events = new EventNode();
    this.messages = new EventNode();
    this.options = null;
    this.auth = null;
    this.resources = resources;
  }

}

module.exports = Sdk;