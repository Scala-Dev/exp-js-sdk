'use strict';
/* jshint -W074 */

const _ = require('lodash');
require('isomorphic-fetch');


const Runtime = require('./Runtime');

const Devices = require('../collections/Devices');
const Things = require('../collections/Things');
const Experiences = require('../collections/Experiences');
const Locations = require('../collections/Locations');
const Data = require('../collections/Data');
const Content = require('../collections/Content');


class Api {

  static fetch (path, options) {
    const url = Runtime.auth.api.url + path;
    options.headers = options.headers || {};
    options.headers.Authorization = 'Bearer ' + Runtime.auth.token;
    options.headers.Accept = 'application/json';
    return fetch(url, options).then(response => {
      return response.json().then(body => {
        body = body || {};
        console.log(body);
        if (!response.ok) throw new Error(body.code || 'unknownError');
        return body;
      });
    });
  }

  static get (path, params) {
    if (params) path += this.encodeQueryString(params);
    return this.fetch(path, { method: 'get' });
  }

  static post (path, params, body) {
    const options = {
      method: 'post',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += this.encodeQueryString(params);
    if (body) options.body = body;
    return this.fetch(path, options);
  }

  static put (path, params, body) {
    const options = {
      method: 'put',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += this.encodeQueryString(params);
    if (body) options.body = body;
    return this.fetch(path, options);
  }

  static patch (path, params, body) {
    const options = {
      method: 'patch',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += this.encodeQueryString(params);
    if (body) options.body = body;
    return this.fetch(path, options);
  }

  static delete (path, params) {
    if (params) path += this.encodeQueryString(params);
    return this.fetch(path, { method: 'delete' });
  }

  static encodeQueryString (params) {
    let parts = [];
    _.forOwn(params, (value, name) => {
      parts.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
    });
    return '?' + parts.join('&');
  }

  static getDelegate (context) {
    return new this.Delegate(context || Math.random());
  }

}


class Delegate {

  constructor (context) {
    this.devices = new Devices(this, context);
    this.things = new Things(this, context);
    this.experiences = new Experiences(this, context);
    this.locations = new Locations(this, context);
    this.data = new Data(this, context);
    this.content = new Content(this, context);
  }

  get (path, params) { return Api.get(path, params); }
  post (path, params, body) { return Api.post(path, params, body); }
  patch(path, params, body) { return Api.patch(path, params, body); }
  put (path, params, body) { return Api.put(path, params, body); }
  delete (path, params) { return Api.post(path, params); }

  getDevice (uuid) { return this.devices.get(uuid); }
  findDevices (params) { return this.devices.find(params); }
  createDevice (document, options) { return this.devices.create(document, options); }
  getCurrentDevice () { { return this.getDevice(Runtime.auth.deviceUuid); }}

  getThing (uuid) { return this.things.get(uuid); }
  findThings (params) { return this.things._find(params); }
  createThing (document, options) { return this.things.create(document, options); }

  getExperience (uuid) { return this.experiences.get(uuid); }
  findExperiences (params) { return this.experiences.find(params); }
  createExperience (document, options) { return this.experiences.create(document, options); }

  getLocation (uuid) { return this.locations.get(uuid); }
  findLocations (params) { return this.locations.find(params); }
  createLocation (document, options) { return this.locations.create(document, options); }

  getData (uuid) { return this.data.get(uuid); }
  findData (params) { return this.data.find(params); }
  createDat (document, options) { return this.data.create(document, options); }

  getContent (uuid) { return this.content.get(uuid); }
  findContent (params) { return this.content.find(params); }
  createContent (document, options) { return this.content.create(document, options); }

}

Api.Delegate = Delegate;

module.exports = Api;