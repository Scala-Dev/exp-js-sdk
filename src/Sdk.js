'use strict';
/* jshint -W074 */

const EventNode = require('event-node');
const _ = require('lodash');

const Authenticator = require('./Authenticator');
const Api = require('./Api');
const Network = require('./Network');

const defaults = { host: 'https://api.goexp.io', enableNetwork: true };

class Sdk {

  constructor () {
    this.started = false;
    this.stopped = false;
    this._events = new EventNode();
    this.options = null;
    this._authenticator = new Authenticator(this);
    this._api = new Api(this);
    this._network = new Network(this);
    this._network.on('online', () => this.events.trigger('online'));
    this._network.on('offline', () => this.events.trigger('offline'));
    this._authenticator.on('error', error => this.events.trigger('error', error));
    this._authenticator.on('update', auth => this.events.trigger('update', auth));
  }


  get events () {
    this.check();
    return this._events;
  }

  get network () {
    this.check();
    return this._network;
  }

  get api () {
    this.check();
    return this._api;
  }

  get authenticator () {
    this.check();
    return this._authenticator;
  }

  check () {
    if (this.stopped) throw new Error('SDK wass stopped.');
  }

  start (options) {
    if (this.started) throw new Error('SDK already running.');
    if (this.stopped) throw new Error('SDK was stopped. Fork to start a new SDK instance.');
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
    this.started = true;
    this.options = options;
    this._network.start();
    this._authenticator.start();
  }

  stop () {
    this.stopped = true;
    this._network.stop();
    this._authenticator.stop();
  }

}

module.exports = Sdk;