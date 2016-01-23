'use strict';

const resources = require('./resources');

const runtime = require('./runtime');
const network = require('./network');
const api = require('./api');
const config = require('./config');
const events = require('./events');
const Channel = require('./Channel');
const ChannelDelegate = require('./ChannelDelegate');

class Sdk {

  constructor (context) {
    this.context = context;
  }

  start (options) { return runtime.start(options); }
  stop () { return runtime.stop(); }
  on (name, callback) { return events.on(name, callback, this.context); }
  getDelegate (context) { return new Sdk(context); }


  get (path, params) { return api.get(path, params); }
  post (path, params, body) { return api.post(path, params, body); }
  patch(path, params, body) { return api.patch(path, params, body); }
  put (path, params, body) { return api.put(path, params, body); }
  delete (path, params) { return api.post(path, params); }

  getDevice (uuid) { return resources.Device.get(uuid, this.context); }
  findDevices (params) { return resources.Device.find(params, this.context); }
  createDevice (document, options) { return resources.Device.create(document, options, this.context); }

  getThing (uuid) { return resources.Thing.get(uuid, this.context); }
  findThings (params) { return resources.Thing.find(params, this.context); }
  createThing (document, options) { return resources.Thing.create(document, options, this.context); }

  getExperience (uuid) { return resources.Experience.get(uuid,  this.context); }
  findExperiences (params) { return resources.Experience.find(params, this.context); }
  createExperience (document, options) { return resources.Experience.create(document, options, this.context); }

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


  get isConnected () { return network.isConnected; }
  get auth () { return config.auth; }

  getChannel (name, options) { return new ChannelDelegate(name, options, this.context); }

}


module.exports = new Sdk();