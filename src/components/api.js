'use strict';
/* jshint -W074 */

const _ = require('lodash');
require('isomorphic-fetch');

const ApiError = require('../lib/ApiError');
const Component = require('../lib/Component');
const ComponentProxy = require('../lib/ComponentProxy');
const runtime = require('../components/runtime');

const Devices = require('../collections/Devices');
const Things = require('../collections/Things');
const Experiences = require('../collections/Experiences');
const Locations = require('../collections/Locations');
const Data = require('../collections/Data');
const Content = require('../collections/Content');


class Api extends Component {

  constructor (Proxy) {
    super(Proxy);
  }

  fetch (path, options) {
    const url = runtime.config.api.host + path;
    options.headers = options.headers || {};
    options.headers.Authorization = 'Bearer ' + runtime.config.token;
    options.headers.Accept = 'application/json';
    return fetch(url, options).then(response => {
      return response.json().then(body => {
        if (!response.ok) {
          throw new ApiError({
            status: response.status,
            code: body.code,
            message: body.message
          });
        }
        return body;
      });
    });
  }

  get (path, params) {
    if (params) path += Api.encodeQueryString(params);
    return this.fetch(path, { method: 'get' });
  }

  post (path, params, body) {
    const options = {
      method: 'post',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += Api.encodeQueryString(params);
    if (body) options.body = body;
    return this.fetch(path, options);
  }

  put (path, params, body) {
    const options = {
      method: 'put',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += Api.encodeQueryString(params);
    if (body) options.body = body;
    return this.fetch(path, options);
  }

  delete (path, params) {
    if (params) path += Api.encodeQueryString(params);
    return this.fetch(path, { method: 'delete' });
  }

  static encodeQueryString (params) {
    let parts = [];
    _.forOwn(params, (value, name) => {
      parts.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
    });
    return '?' + parts.join('&');
  }

}


class Proxy extends ComponentProxy {

  constructor (context) {
    super(context);
    this._devices = new Devices(context);
    this._things = new Things(context);
    this._experiences = new Experiences(context);
    this._locations = new Locations(context);
    this._data = new Data(context);
    this._content = new Content(context);
  }

  getDevice (uuid) { return this._devices.get(uuid); }
  findDevices (params) { return this._devices.find(params); }
  createDevice (document) { return this._devices.create(document); }
  getCurrentDevice () { { return this.getDevice(runtime.config.deviceUuid); }}

  getThing (uuid) { return this._things.get(uuid); }
  findThings (params) { return this._things._find(params); }
  createThing (document) { return this._things.create(document); }

  getExperience (uuid) { return this._experiences.get(uuid); }
  findExperiences (params) { return this._experiences._find(params); }
  createExperience (document) { return this._experiences.create(document); }

  getLocation (uuid) { return this._locations.get(uuid); }
  findLocations (params) { return this._locations._find(params); }
  createLocation (document) { return this._locations.create(document); }

  getData (uuid) { return this._data.get(uuid); }
  findData (params) { return this._data._find(params); }
  createDat (document) { return this._data.create(document); }

  getContent (uuid) { return this._content.get(uuid); }
  findContent (params) { return this._content._find(params); }
  createContent (document) { return this._content.create(document); }  

}


const api = new Api(Proxy);


module.exports = api;
