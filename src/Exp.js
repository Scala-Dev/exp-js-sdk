'use strict';
/* jshint -W074 */

const EventNode = require('event-node');
const Sdk = require('./Sdk');

class Exp {

  constructor (sdk, context) {
    this.__sdk = sdk;
    this._context = context || Math.random().toString();
  }

  start (options) {
    const sdk = new Sdk();
    sdk.start(options);
    if (!this.__sdk) {
      this.__sdk = sdk;
      return this;
    }
    return this.constructor(sdk);
  }

  clone (context) {
    return this.constructor(this._sdk, context);
  }

  stop () {
    return this._sdk.stop();
  }

  getAuth () {
    return this._sdk.authenticator.getAuth();
  }

  getChannel (name, options) {
    return this._sdk.network.getChannel(name, options, this._context);
  }

  on (name, callback) {
    return this._sdk.events.on(name, callback, this._context);
  }

  get isConnected () {
    return this._sdk.network.isConnected;
  }



  get _sdk () {
    if (!this.__sdk) throw new Error('The SDK is not started.');
    return this.__sdk;
  }


  get (path, params) { return this._sdk.api.get(path, params); }
  post (path, params, body) { return this._sdk.api.post(path, params, body); }
  patch(path, params, body) { return this._sdk.api.patch(path, params, body); }
  put (path, params, body) { return this._sdk.api.put(path, params, body); }
  delete (path, params) { return this._sdk.api.post(path, params); }

  getDevice (uuid) { return this._sdk.api.Device.get(uuid, this._sdk, this._context); }
  findDevices (params) { return this._sdk.api.Device.find(params, this._sdk, this._context); }
  createDevice (document) { return this._sdk.api.Device.create(document, this._sdk, this._context); }


  getExperience (uuid) { return this._sdk.api.Experience.get(uuid, this._sdk, this._context); }
  findExperiences (params) { return this._sdk.api.Experience.find(params, this._sdk, this._context); }
  createExperience (document) { return this._sdk.api.Experience.create(document, this._sdk, this._context); }
/*
  getThing (uuid) { return resources.Thing.get(uuid, this.context); }
  findThings (params) { return resources.Thing.find(params, this.context); }
  createThing (document, options) { return resources.Thing.create(document, options, this.context); }

  

  getLocation (uuid) { return resources.Location.get(uuid, this.context); }
  findLocations (params) { return resources.Location.find(params, this.context); }
  createLocation (document, options) { return resources.Location.create(document, options, this.context); }

  getData (key, group) { return resources.Data.get(key, group, this.context); }
  findData (params) { return resources.Data.find(params, this.context); }
  createData (document, options) { return resources.Data.create(document, options, this.context); }

  getContent (uuid) { return resources.Content.get(uuid, this.context); }
  findContent (params) { return resources.Content.find(params, this.context); }

  getFeed (uuid) { return resources.Feed.get(uuid, this.context); }
  findFeeds (params) { return resources.Feed.find(params, this.context); }
  createFeed (document, options) { return resources.Feed.create(document, options, this.context); }

*/
  get EventNode () { return EventNode; }





}


module.exports = Exp;