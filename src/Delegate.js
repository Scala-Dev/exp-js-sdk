'use strict';
/* jshint -W074 */

const EventNode = require('event-node');
const Sdk = require('./Sdk');

class Delegate {

  constructor (sdk, context) {
    this.__sdk = sdk || new Sdk();
    this._context = context || Math.random().toString();
  }

  get _sdk () {
    if (!this.__sdk) throw new Error('SDK was stopped.');
    return this.__sdk;
  }

  /* Runtime */
  stop () { this._sdk.stop(); delete this.__sdk; }
  clone (context) { return new this.constructor(this._sdk, context); }
  clear (context) { return EventNode.clear(context || this._context); }
  getAuth () { return this._sdk.authenticator.getAuth(); }
  on (name, callback) { return this._sdk.events.on(name, callback, this._context); }

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

  /* Data */
  getData (key, group) { return this._sdk.api.Data.get({ key: key, group: group }, this._sdk, this._context); }
  findData (params) { return this._sdk.api.Data.find(params, this._sdk, this._context); }
  createData (document) { return this._sdk.api.Data.create(document, this._sdk, this._context); }

  /* Content */
  getContent (uuid) { return this._sdk.api.Content.get({ uuid: uuid }, this._sdk, this._context); }
  findContent (params) { return this._sdk.api.Content.find(params, this._sdk, this._context); }

  /* Feeds */
  getFeed (uuid) { return this._sdk.api.Feed.get({ uuid: uuid }, this._sdk, this._context); }
  findFeeds (params) { return this._sdk.api.Feed.find(params, this._sdk, this._context); }

}


module.exports = Delegate;