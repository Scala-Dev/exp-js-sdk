'use strict';
/* jshint -W074 */

const _ = require('lodash');
const EventNode = require('event-node');

const Authenticator = require('./Authenticator');
const API = require('./API');
const Network = require('./Network');

const defaults = { host: 'https://api.goexp.io', enableNetwork: true };


class SDK {

  constructor (options) {
    this.options = options;
    this.events = new EventNode();
    this.authenticator = new Authenticator(this);
    this.api = new API(this);
    this.network = new Network(this);
  }

  stop () {
    this.network.stop();
    this.authenticator.stop();
    this.constructor.instances.splice(this.constructor.instances.indexOf(this), 1);
  }

  start () {
    this.network.start();
    this.authenticator.start();
    this.constructor.instances.push(this);
  }

  static stop () {
    this.instances.map(sdk => sdk).forEach(sdk => sdk.stop());
  }

  static start (options) {
    const sdk = new this(this.validate(options));
    sdk.start();
    return sdk;
  }

  static validate (options) {
    options = _.merge({}, defaults, options);
    if (options.type === 'user' || options.username || options.password || options.organization) {
      options.type = 'user';
      if (!options.username) throw new Error('Please specify the username.');
      if (!options.password) throw new Error('Please specify the password.');
      if (!options.organization) throw new Error('Please specify the organization.');
    } else if (options.type === 'device' || options.secret || options.allowPairing) {
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
    return options;
  }

}

SDK.instances = [];


class EXP {

  constructor (sdk, context) {
    this.__sdk = sdk;
    this._context = context || Math.random().toString();
    this.EventNode = EventNode;
  }

  get _sdk () { if (!this.__sdk) throw new Error('SDK was stopped.'); return this.__sdk; }

  static start (options) { const sdk = SDK.start(options); return new this(sdk); }
  static stop () { return SDK.stop(); }
  static get EventNode () { return EventNode; }
  static clear (context) { return this.EventNode.clear(context); }

  /* Runtime */
  stop () { this._sdk.stop(); delete this.__sdk; }
  getAuth () { return this._sdk.authenticator.getAuth(); }
  on (name, callback) { return this._sdk.events.on(name, callback, this._context); }
  get auth () { return this._sdk.authenticator.getAuthSync(); }

  /* Undocumented Memory Management */
  clone (context) { return new this.constructor(this._sdk, context); }
  clear () { return EventNode.clear(this._context); }

  /* Network */
  getChannel (name, options) { return this._sdk.network.getChannel(name, options, this._context); }
  get isConnected () { return this._sdk.network.isConnected; }

  /* Naked API */
  get (path, params) { return this._sdk.api.get(path, params); }
  post (path, body, params) { return this._sdk.api.post(path, body, params); }
  patch(path, body, params) { return this._sdk.api.patch(path, body, params); }
  put (path, body, params) { return this._sdk.api.put(path, body, params); }
  delete (path, params) { return this._sdk.api.delete(path, params); }

  /* Devices */
  getDevice (uuid) { return this._sdk.api.Device.get(uuid, this._sdk, this._context); }
  findDevices (params) { return this._sdk.api.Device.find(params, this._sdk, this._context); }
  createDevice (document) { return this._sdk.api.Device.create(document, this._sdk, this._context); }

  /* Things */
  getThing (uuid) { return this._sdk.api.Thing.get(uuid, this._sdk, this._context); }
  findThings (params) { return this._sdk.api.Thing.find(params, this._sdk, this._context); }
  createThing (document) { return this._sdk.api.Thing.create(document, this._sdk, this._context); }

  /* Experiences */
  getExperience (uuid) { return this._sdk.api.Experience.get(uuid, this._sdk, this._context); }
  findExperiences (params) { return this._sdk.api.Experience.find(params, this._sdk, this._context); }
  createExperience (document) { return this._sdk.api.Experience.create(document, this._sdk, this._context); }

  /* Locations */
  getLocation (uuid) { return this._sdk.api.Location.get(uuid, this._sdk, this._context); }
  findLocations (params) { return this._sdk.api.Location.find(params, this._sdk, this._context); }
  createLocation (document) { return this._sdk.api.Location.create(document, this._sdk, this._context); }

  /* Feeds */
  getFeed (uuid) { return this._sdk.api.Feed.get(uuid, this._sdk, this._context); }
  findFeeds (params) { return this._sdk.api.Feed.find(params, this._sdk, this._context); }
  createFeed (document) { return this._sdk.api.Feed.create(document, this._sdk, this._context); }

  /* Content */
  getContent (uuid) { return this._sdk.api.Content.get(uuid, this._sdk, this._context); }
  findContent (params) { return this._sdk.api.Content.find(params, this._sdk, this._context); }

  /* Data */
  getData (group, key) { return this._sdk.api.Data.get(group, key, this._sdk, this._context); }
  findData (params) { return this._sdk.api.Data.find(params, this._sdk, this._context); }
  createData (group, key, value) { return this._sdk.api.Data.create(group, key, value, this._sdk, this._context); }

}


module.exports = EXP;