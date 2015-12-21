'use strict';

const Api = require('./Api');
const runtime = require('../runtime');

const Device = require('./Device');
const Thing = require('./Thing');
const Experience = require('./Experience');
const Location = require('./Location');
const Data = require('./Data');
const Content = require('./Content');

class Delegate {

  constructor (context) {
    this._context = context || Math.random();
  }

  getDelegate (context) {
    return new this.constructor(context);
  }

  get (path, params) { return Api.get(path, params); }
  post (path, params, body) { return Api.post(path, params, body); }
  patch(path, params, body) { return Api.patch(path, params, body); }
  put (path, params, body) { return Api.put(path, params, body); }
  delete (path, params) { return Api.post(path, params); }

  getDevice (uuid) { return Device.get(uuid, this._context); }
  findDevices (params) { return Device.find(params, this._context); }
  createDevice (document, options) { return Device.create(document, options, this._context); }
  getCurrentDevice () { return Device.get(runtime.auth.deviceUuid, this._context); }

  getThing (uuid) { return Thing.get(uuid, this._context); }
  findThings (params) { return Thing.find(params, this._context); }
  createThing (document, options) { return Thing.create(document, options, this._context); }

  getExperience (uuid) { return Experience.get(uuid, this._context); }
  findExperiences (params) { return Experience.find(params, this._context); }
  createExperience (document, options) { return Experience.create(document, options, this._context); }

  getLocation (uuid) { return Location.get(uuid, this._context); }
  findLocations (params) { return Location.find(params, this._context); }
  createLocation (document, options) { Location.create(document, options, this._context); }

  getData (key, group) { return Data.get(key, group, this._context); }
  findData (params) { return Data.find(params, this._context); }
  createData (document, options) { return Data.create(document, options, this._context); }

  getContent (uuid) { return Content.get(uuid, this._context); }
  findContent (params) { return Content.find(params, this._context); }
  createContent (document, options) { return Content.create(document, options, this._context); }

}

module.exports = Delegate;