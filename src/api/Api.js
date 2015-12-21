'use strict';
/* jshint -W074 */

const _ = require('lodash');
require('isomorphic-fetch');


const runtime = require('../runtime');

const Devices = require('../collections/Devices');
const Things = require('../collections/Things');
const Experiences = require('../collections/Experiences');
const Locations = require('../collections/Locations');
const Data = require('../collections/Data');
const Content = require('../collections/Content');


class Api {

  static fetch (path, options) {
    const url = runtime.auth.api.url + path;
    options.headers = options.headers || {};
    options.headers.Authorization = 'Bearer ' + runtime.auth.token;
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




Api.Delegate = Delegate;

module.exports = Api;