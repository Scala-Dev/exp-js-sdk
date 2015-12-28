'use strict';

require('isomorphic-fetch');
var credentials = require('../credentials');
var config = require('../config');

var fetch_ = function fetch_(path, options) {
  var url = config.host + path;
  options.headers = options.headers || {};
  return Promise.resolve().then(function () {
    return credentials.getToken();
  }).then(function (token) {
    options.headers.Authorization = 'Bearer ' + token;
    return fetch(url, options);
  }).then(function (response) {
    return response.json();
  })['catch'](function (error) {
    throw new Error(error);
  });
};

var createQueryString = function createQueryString(obj) {
  var parts = ['?'];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
  }
  return parts.join('&');
};

var get = function get(path, params) {
  if (params) path += createQueryString(params);
  return fetch_(path, { method: 'get' });
};

module.exports.get = get;