'use strict';

/**
 * Credentials
 * @namespace scala.credentials
 */

const crypto = require('crypto');
const base64url = require('base64url');

const utilities = require('./utilities');

var uuid;
var secret;


/** 
 * Event Node (see {@link scala.utilities.EventNode})
 * @namespace scala.credentials.events
 */
/**
 * The credentials have changed.
 * @memberof  scala.credentials.events
 * @event change
 */
const events = new utilities.EventNode;

/**
 * Set the uuid and secret of the device.
 * @name set
 * @memberOf scala.credentials
 * @method
 * @param {string} uuid The device's uuid.
 * @param {string} secret The device's secret.
 * @returns {Promise} A promise representing the events triggered by the setting of the credentials.
 */
function set (uuid_, secret_) {
  uuid = uuid_;
  secret = secret_;
  return events.trigger('change');
}

/**
 * Generate a token for an API request.
 * @name generateToken
 * @memberOf scala.credentials
 * @method
 * @returns {Promise} A promise the will resolve with the auth token.
 */
function generateToken () {
  return Promise.resolve()
    .then(() => {
      if (!uuid || !secret) {
        throw new utilities.Error('noCredentials', 'You must supply credentials');
      }
    })
    .then(() => {
      var header = JSON.stringify({ alg: 'HS256', 'typ': 'JWT' });
      var body = JSON.stringify({ uuid: uuid });
      var hmac = crypto.createHmac('sha256', secret);
      var message = base64url.encode(header) + '.' + base64url.encode(body);
      return  message + '.' + base64url.encode(hmac.update(message).digest());
    });
}

module.exports.set = set;
module.exports.generateToken = generateToken;
module.exports.events = events;
