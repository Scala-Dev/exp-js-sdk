'use strict';

const resources = require('./resources');

class Delegate {

  constructor (sdk, context) {
    this.sdk = sdk;
    this.context = context;
  }

  start (options) { return this.sdk.runtime.start(options); }
  stop () { return this.sdk.runtime.stop(); }

  on (name, callback) { return this.sdk.events.on(name, callback, this.context); }

  getDelegate (context) { return new Delegate(this.sdk, context); }

  get isConnected () { return this.sdk.network.isConnected; }
  get auth () { return this.sdk.auth; }
  get options () { return this.sdk.options; }

  get (path, params) { return this.sdk.api.get(path, params); }
  post (path, params, body) { return this.sdk.api.post(path, params, body); }
  patch(path, params, body) { return this.sdk.api.patch(path, params, body); }
  put (path, params, body) { return this.sdk.api.put(path, params, body); }
  delete (path, params) { return this.sdk.api.post(path, params); }

  getDevice (uuid) { return resources.Device.get(uuid, this.sdk, this.context); }
  findDevices (params) { return resources.Device.find(params, this.sdk, this.context); }
  createDevice (document, options) { return resources.Device.create(document, options, this.sdk, this.context); }

  getThing (uuid) { return resources.Thing.get(uuid, this.sdk, this.context); }
  findThings (params) { return resources.Thing.find(params, this.sdk, this.context); }
  createThing (document, options) { return resources.Thing.create(document, options, this.sdk, this.context); }

  getExperience (uuid) { return resources.Experience.get(uuid, this.sdk, this.context); }
  findExperiences (params) { return resources.Experience.find(params, this.sdk, this.context); }
  createExperience (document, options) { return resources.Experience.create(document, options, this.sdk, this.context); }

  getLocation (uuid) { return resources.Location.get(uuid, this.sdk, this.context); }
  findLocations (params) { return resources.Location.find(params, this.sdk, this.context); }
  createLocation (document, options) { return resources.Location.create(document, options, this.sdk, this.context); }

  getData (key, group) { return resources.Data.get(key, group, this.sdk, this.context); }
  findData (params) { return resources.Data.find(params, this.sdk, this.context); }
  createData (document, options) { return resources.Data.create(document, options, this.sdk, this.context); }

  getContent (uuid) { return resources.Content.get(uuid, this.sdk, this.context); }
  findContent (params) { return resources.Content.find(params, this.sdk, this.context); }

  getFeed (uuid) { return resources.Feed.get(uuid, this.sdk, this.context); }
  findFeeds (params) { return resources.Feed.find(params, this.sdk, this.context); }
  createFeed (document, options) { return resources.Feed.create(document, options, this.sdk, this.context); }

  getChannel (name) { return new resources.Channel(name || 'default', this.sdk, this.context); }

  broadcast (name, payload, options) { return this.getChannel().broadcast(name, payload, options); }
  listen (name, callback, options) { return this.getChannel().listen(name, callback, options); }
  request (target, name, payload, options) { return this.getChannel().request(target, name, payload, options); }
  respond (name, callback, options) { return this.getChannel().respond(name, callback, options); }



}


module.exports = Delegate;