'use strict';

const Api = require('./Api');
const runtime = require('../runtime');
const collections = require('./collections');


class Delegate {

  constructor (context) {
    this._devices = new collections.Devices(this, context);
    this._things = new collections.Things(this, context);
    this._experiences = new collections.Experiences(this, context);
    this._locations = new collections.Locations(this, context);
    this._data = new collections.Data(this, context);
    this._content = new collections.Content(this, context);
  }

  get (path, params) { return Api.get(path, params); }
  post (path, params, body) { return Api.post(path, params, body); }
  patch(path, params, body) { return Api.patch(path, params, body); }
  put (path, params, body) { return Api.put(path, params, body); }
  delete (path, params) { return Api.post(path, params); }

  getDevice (uuid) { return this._devices.get(uuid); }
  findDevices (params) { return this._devices.find(params); }
  createDevice (document, options) { return this._devices.create(document, options); }
  getCurrentDevice () { { return this.getDevice(runtime.auth.deviceUuid); }}

  getThing (uuid) { return this._things.get(uuid); }
  findThings (params) { return this._things._find(params); }
  createThing (document, options) { return this._things.create(document, options); }

  getExperience (uuid) { return this._experiences.get(uuid); }
  findExperiences (params) { return this._experiences.find(params); }
  createExperience (document, options) { return this._experiences.create(document, options); }

  getLocation (uuid) { return this._locations.get(uuid); }
  findLocations (params) { return this._locations.find(params); }
  createLocation (document, options) { return this._locations.create(document, options); }

  getData (uuid) { return this._data.get(uuid); }
  findData (params) { return this._data.find(params); }
  createDat (document, options) { return this._data.create(document, options); }

  getContent (uuid) { return this._content.get(uuid); }
  findContent (params) { return this._content.find(params); }
  createContent (document, options) { return this._content.create(document, options); }

}

module.exports = Delegate;