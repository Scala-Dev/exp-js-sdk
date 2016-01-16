'use strict';
/* jshint -W074 */

const _ = require('lodash');
require('isomorphic-fetch');



class Api {

  static setAuth (auth) {
    this.auth = auth;
  }


  static fetch (path, options) {
    const url = this.auth.api.host + path;
    options.cors = true;
    options.credentials = 'include';
    options.headers = options.headers || {};
    options.headers.Authorization = 'Bearer ' + this.auth.token;
    options.headers.Accept = 'application/json';
    return fetch(url, options).then(response => {
      return response.json().then(body => {
        body = body || {};
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

}

module.exports = Api;