'use strict';

require('isomorphic-fetch');

const crypto = require('crypto');
const base64url = require('base64url');
const config = require('./config');
        
var locals = { tokenTime: 0 };

const refreshToken = () => {
  if (locals.uuid && locals.secret) {
    return refreshDeviceToken();
  } else if (locals.username && locals.password && locals.organization) {
    return refreshUserToken();
  } else {
    return Promise.reject('No token available.');
  }
};

const refreshUserToken = () => {
  return fetch(config.host + '/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: locals.username,
      password: locals.password,
      organization: locals.organization
    })
  }).then(response => {
    if (!response.ok) return Promise.reject('Authentication failed');
    return response.json().then(body => {
      locals.token = body.token;
      return locals.token;
    });
  });
};

const refreshDeviceToken = () => {
  var header = JSON.stringify({ alg: 'HS256', 'typ': 'JWT' });
  var body = JSON.stringify({ uuid: locals.uuid });
  var hmac = crypto.createHmac('sha256', locals.secret);
  var message = base64url.encode(header) + '.' + base64url.encode(body);
  locals.token = message + '.' + base64url.encode(hmac.update(message).digest());
  locals.tokenTime = new Date();
  return Promise.resolve(locals.token);
};

module.exports.setDeviceCredentials = (uuid, secret) => {
  module.exports.clear();
  locals.uuid = uuid;
  locals.secret = secret;
};

module.exports.setUserCredentials = (username, password, organization) => {
  module.exports.clear();
  locals.username = username;
  locals.password = password;
  locals.organization = organization;
};

module.exports.setToken = token => {
  module.exports.clear();
  locals.token = token;
  locals.tokenTime = Infinity;
};

module.exports.getToken = () => {
  if (locals.token && (new Date() - locals.tokenTime) < 3600 * 1000) {
    return Promise.resolve(locals.token);
  }
  return refreshToken();
};

module.exports.clear = () => {
  locals = {};
  locals.tokenTime = 0;
};




// DEPRECATED
module.exports.set = (uuid, secret) => {
  console.log('SDK DEPRECATED: Set in credentials.');
  locals.uuid = uuid;
  locals.secret = secret;
};

// DEPRECATED
module.exports.generateToken = () => {
  console.warn('SDK DEPRECATED: generateToken in credentials.');
  return Promise.resolve()
    .then(() => {
      if (!locals.uuid || !locals.secret) {
        throw new Error('No credentials available.');
      }
      var header = JSON.stringify({ alg: 'HS256', 'typ': 'JWT' });
      var body = JSON.stringify({ uuid: locals.uuid });
      var hmac = crypto.createHmac('sha256', locals.secret);
      var message = base64url.encode(header) + '.' + base64url.encode(body);
      return  message + '.' + base64url.encode(hmac.update(message).digest());
    });
};
