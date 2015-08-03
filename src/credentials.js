'use strict';

const crypto = require('crypto');
const base64url = require('base64url');

var uuid, secret;

module.exports.set = (uuid_, secret_) => {
  uuid = uuid_;
  secret = secret_;
};

module.exports.generateToken = () => {
  return Promise.resolve()
    .then(() => {
      if (!uuid || !secret) {
        throw new Error('No credentials available.');
      }
      var header = JSON.stringify({ alg: 'HS256', 'typ': 'JWT' });
      var body = JSON.stringify({ uuid: uuid });
      var hmac = crypto.createHmac('sha256', secret);
      var message = base64url.encode(header) + '.' + base64url.encode(body);
      return  message + '.' + base64url.encode(hmac.update(message).digest());
    });
};
