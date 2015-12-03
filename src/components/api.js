'use strict';
/* jshint -W074 */

const _ = require('lodash');
const jwt = require('jsonwebtoken');

require('isomorphic-fetch');

const SdkError = require('../lib/SdkError');
const ApiError = require('../lib/ApiError');
const Component = require('../lib/Component');
const ComponentProxy = require('../lib/ComponentProxy');
const runtime = require('../components/runtime');




class Api extends Component {

  constructor (Proxy) {
    super(Proxy);
    this.token = '';
    this.host = '';
  }

  fetch (path, options) {
    const url = this.host + path;
    options.headers = options.headers || {};
    options.headers.Authorization = 'Bearer ' + this.token;
    options.headers.Accept = 'application/json';
    return fetch(url, options).then(response => {
      return response.json().then(body => {
        if (!response.ok) {
          throw new ApiError({
            status: response.status,
            code: document.code,
            message: document.message
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

const Devices = require('../collections/Devices');

class Proxy extends ComponentProxy {

  constructor (context) {
    super(context);
    this._devices = new Devices(context);
  }

  getDevice (uuid) {
    return this._devices.get(uuid);
  }

  getDevices (params) {
    return this._devices.find(params);
  }

}

const api = new Api(Proxy);

runtime.on('auth', auth => {
  api.host = auth.apiHost;
  api.token = auth.token;
});

module.exports = api;
