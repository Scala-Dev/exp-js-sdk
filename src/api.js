'use strict';

/**
 * Shortcut for API Calls
 * @namespace scala.api
 */

require('isomorphic-fetch');
const credentials = require('./credentials');

const base = 'http://localhost:9000';

const createQueryString = obj => {
  var parts = ['?'];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
  }
  return parts.join('&');
};

const get = (path, params) => {
  if (params) path += createQueryString(params);
  return fetch_(path, { method: 'get' });
};


/**
 * Make a remote request
 * @name fetch
 * @memberOf scala.api
 * @method
 * @param {string} path The api path, i.e., /api/devices
 * @param {object} options Fetch compatible options.
 * @returns {Promise} A promise that will resolve with a javascript object.
 */
const fetch_ = (path, options) => {
  const url = base + path;
  options.headers = options.headers || {};
  return Promise.resolve()
    .then(() => credentials.generateToken())
    .then(token => {
      options.headers.Authorization = 'Bearer ' + token;
      return fetch(url, options);
    })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      throw new Error(error);
    });
  
};


module.exports.fetch = fetch_;
module.exports.get = get;

