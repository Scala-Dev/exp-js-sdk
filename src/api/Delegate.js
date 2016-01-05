'use strict';

const Api = require('./Api');
const resources = require('./resources');

class Delegate {

  constructor (context) {
    this._context = context || Math.random();
  }

  getDelegate (context) {
    return new this.constructor(context);
  }

  clear () {}

  get (path, params) { return Api.get(path, params); }
  post (path, params, body) { return Api.post(path, params, body); }
  patch(path, params, body) { return Api.patch(path, params, body); }
  put (path, params, body) { return Api.put(path, params, body); }
  delete (path, params) { return Api.post(path, params); }

  getDevice (uuid) { return resources.Device.get(uuid, this._context); }
  findDevices (params) { return resources.Device.find(params, this._context); }
  createDevice (document, options) { return resources.Device.create(document, options, this._context); }

  getThing (uuid) { return resources.Thing.get(uuid, this._context); }
  findThings (params) { return resources.Thing.find(params, this._context); }
  createThing (document, options) { return resources.Thing.create(document, options, this._context); }

  getExperience (uuid) { return resources.Experience.get(uuid, this._context); }
  findExperiences (params) { return resources.Experience.find(params, this._context); }
  createExperience (document, options) { return resources.Experience.create(document, options, this._context); }

  getLocation (uuid) { return resources.Location.get(uuid, this._context); }
  findLocations (params) { return resources.Location.find(params, this._context); }
  createLocation (document, options) { return resources.Location.create(document, options, this._context); }

  getData (key, group) { return resources.Data.get(key, group, this._context); }
  findData (params) { return resources.Data.find(params, this._context); }
  createData (document, options) { return resources.Data.create(document, options, this._context); }

  getContent (uuid) { return resources.Content.get(uuid, this._context); }
  findContent (params) { return resources.Content.find(params, this._context); }
  createContent (document, options) { return resources.Content.create(document, options, this._context); }

}

module.exports = Delegate;