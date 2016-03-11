'use strict';
/* jshint -W074 */


const Authenticator = require('./Authenticator');
const Api = require('./Api');
const Network = require('./Network');

const EventNode = require('event-node');
const _ = require('lodash');

const defaults = { host: 'https://api.goexp.io', enableNetwork: true };

class Sdk {

  constructor () {
    this.authenticator = new Authenticator(this);
    this.api = new Api(this);
    this.network = new Network(this);
    this.events = new EventNode();
    this.options = null;
    this.network.on('online', () => this.events.trigger('online'));
    this.network.on('offline', () => this.events.trigger('offline'));
    this.authenticator.on('error', error => this.events.trigger('error', error));
    this.authenticator.on('update', auth => this.events.trigger('update', auth));
  }

  start (options) {
    options = _.merge({}, defaults, options);
    if (options.type === 'user' || options.username || options.password || options.organization) {
      options.type = 'user';
      if (!options.username) throw new Error('Please specify the username.');
      if (!options.password) throw new Error('Please specify the password.');
      if (!options.organization) throw new Error('Please specify the organization.');
    } else if (options.type === 'device' || options.secret) {
      options.type = 'device';
      if (!options.uuid && !options.allowPairing) throw new Error('Please specify the uuid.');
      if (!options.secret && !options.allowPairing) throw new Error('Please specify the device secret.');
    } else if (options.type === 'consumerApp' || options.apiKey) {
      options.type = 'consumerApp';
      if (!options.uuid) throw new Error('Please specify the uuid.');
      if (!options.apiKey) throw new Error('Please specify the apiKey');
    } else {
      throw new Error('Please specify authentication type.');
    }
    this.options = options;
    this.network.start();
    this.authenticator.start();
  }

  stop () {
    this.network.stop();
    this.authenticator.stop();
    this.events.clear();
  }

}

module.exports = Sdk;