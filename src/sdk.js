'use strict';
/* jshint -W074 */

const EventNode = require('event-node');
const _ = require('lodash');

const resources = require('./resources');
const runtime = require('./runtime');
const network = require('./network');
const api = require('./api');
const ChannelDelegate = require('./ChannelDelegate');


class Events extends EventNode {

  constructor () {
    super();
    runtime.on('update', auth => this.trigger('authenticated', auth));
    runtime.on('error', error => this.trigger('error', error));
    network.on('online', () => this.trigger('online'));
    network.on('offline', () => this.trigger('offline'));
  }

}

class Sdk {

  constructor (context) {
    this.context = context;
    if (!this.constructor.events) this.constructor.events = new Events();
  }

  start (options) {
    if (this.constructor.started) return Promise.reject(new Error('Runtime already started.'));
    this.constructor.started = true;
    const defaults = { host: 'https://api.goexp.io', enableEvents: true };
    options = _.merge({}, defaults, options);
    if (options.type === 'user' || options.username || options.password || options.organization) {
      options.type = 'user';
      if (!options.username) return Promise.reject(new Error('Please specify the username.'));
      if (!options.password) return Promise.reject(new Error('Please specify the password.'));
      if (!options.organization) return Promise.reject(new Error('Please specify the organization.'));
    } else if (options.type === 'device' || options.secret) {
      options.type = 'device';
      if (!options.uuid && !options.allowPairing) return Promise.reject(new Error('Please specify the uuid.'));
      if (!options.secret && !options.allowPairing) return Promise.reject(new Error('Please specify the device secret.'));
    } else if (options.type === 'consumerApp' || options.apiKey) {
      options.type = 'consumerApp';
      if (!options.uuid) return Promise.reject(new Error('Please specify the uuid.'));
      if (!options.apiKey) return Promise.reject(new Error('Please specify the apiKey'));
    } else {
      return Promise.reject(new Error('Please specify authentication type.'));
    }
    if (options.enableEvents) network.start();
    return new Promise((resolve, reject) => {
      if (options.enableEvents) {
        network.start(options);
        network.on('online', resolve);
      } else {
        runtime.on('update', resolve);
      }
      runtime.on('error', reject);
      runtime.start(options);
    });
  }

  on (name, callback) { return this.constructor.events.on(name, callback, this.context); }
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

  getData (group, key) { return resources.Data.get(group, key, this.context); }
  findData (params) { return resources.Data.find(params, this.context); }
  createData (document, options) { return resources.Data.create(document, options, this.context); }

  getContent (uuid) { return resources.Content.get(uuid, this.context); }
  findContent (params) { return resources.Content.find(params, this.context); }

  getFeed (uuid) { return resources.Feed.get(uuid, this.context); }
  findFeeds (params) { return resources.Feed.find(params, this.context); }
  createFeed (document, options) { return resources.Feed.create(document, options, this.context); }


  get EventNode () { return EventNode; }


  get isConnected () { return network.isConnected; }

  get auth () { return runtime.auth; }

  getChannel (name, options) { return ChannelDelegate.create(name, options, this.context); }


}


module.exports = new Sdk();
