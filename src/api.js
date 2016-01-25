'use strict';

require('isomorphic-fetch');

const authManager = require('./authManager');



class Api {

  fetch (path, options) {
    return authManager.get().then(auth => {
      const url = auth.api.host + path;
      options.cors = true;
      options.credentials = 'include';
      options.headers = options.headers || {};
      options.headers.Authorization = 'Bearer ' + auth.token;
      options.headers.Accept = 'application/json';
      return fetch(url, options).then(response => {
        return response.json().then(body => {
          body = body || {};
          if (!response.ok) throw new Error(body.code || 'unknownError');
          return body;
        });
      });
    });
  }

  get (path, params) {
    if (params) path += this.encodeQueryString(params);
    return this.fetch(path, { method: 'get' });
  }

  post (path, params, body) {
    const options = {
      method: 'post',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += this.encodeQueryString(params);
    if (body) options.body = body;
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    return this.fetch(path, options);
  }

  put (path, params, body) {
    const options = {
      method: 'put',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += this.encodeQueryString(params);
    if (body) options.body = body;
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    return this.fetch(path, options);
  }

  patch (path, params, body) {
    const options = {
      method: 'patch',
      headers:  { 'Content-Type': 'application/json' }
    };
    if (params) path += this.encodeQueryString(params);
    if (body) options.body = body;
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    return this.fetch(path, options);
  }

  delete (path, params) {
    if (params) path += this.encodeQueryString(params);
    return this.fetch(path, { method: 'delete' });
  }

  encodeQueryString (params) {
    let parts = [];
    Object.keys(params).forEach(name => {
      parts.push(encodeURIComponent(name) + '=' + encodeURIComponent(params[name]));
    });
    return '?' + parts.join('&');
  }

}

module.exports = new Api();