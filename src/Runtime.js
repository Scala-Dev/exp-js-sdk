'use strict';
/* jshint -W074 */

const _ = require('lodash');

const jwt = require('jsonwebtoken');

const events = require('./events');
const api = require('./api');
const network = require('./network');

require('isomorphic-fetch');

const defaults = {
  host: 'https://api.goexp.io',
  enableEvents: true
};



class Runtime {

  constructor (sdk) {
    this.sdk = sdk;
    this.options = null;
    this.auth = null;
  }

  start (options) {
    this.active = true;
    this.options = _.merge(_.merge({}, defaults), options);
    this.sdk.events.trigger('start');
    this.promise = new Promise((a, b) => { this.resolve = a; this.reject = b });
    try { this.validate() }
    catch (error) { this.abort(error); }
    this.login();
    return this.promise;
  }

  abort (error) {
    this.sdk.events.trigger('error', error);
    this.reject(error);
    this.stop();
  }

  stop () {
    this.active = false;
    this.options = null;
    this.auth = null;
    this.reject(new Error('Runtime stopped.'));
    this.sdk.events.trigger('stop');
  }

  validate () {
    if (this.options.type === 'user') {
      if (!this.options.username) throw new Error('Please specify the username.');
      if (!this.options.password) throw new Error('Please specify the password.');
      if (!this.options.organization) throw new Error('Please specify the organization.');
    } else if (this.options.type === 'device') {
      if (!this.options.uuid) throw new Error('Please specify the uuid.');
      if (!this.options.secret && !this.options.allowPairing) throw new Error('Please specify the device secret.');
    } else if (this.options.type === 'consumerApp') {
      if (!this.options.uuid) throw new Error('Please specify the uuid.');
      if (!this.options.apiKey) throw new Error('Please specify the apiKey');
    } else {
      throw new Error('Please specify authentication type.');
    }
  }

  login () {
    if (!this.active) return;
    let payload;
    if (this.options.type === 'user') {
      payload = {
        type: 'user',
        username: this.options.username,
        password: this.options.password,
        organization: this.options.organization
      };
    } else if (this.options.type === 'device') {
      payload = {
        token: jwt.sign({
          type: 'device',
          uuid: this.options.uuid,
          allowPairing: this.options.allowPairing,
        }, this.options.secret || '_')
      };
    } else if (this.options.type === 'consumerApp') {
      payload = {
          token : jwt.sign({
          type: 'consumerApp',
          uuid: this.options.uuid,
        }, this.options.apiKey)
      };
    }
    fetch(this.options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(response => {
      if (!this.active) return;
      else if (response.status === 401) this.abort(new Error('Authentication failed. Please check your credentials.'));
      else if (!response.ok) throw new Error();
      else return response.json(auth => this.onSuccess(auth));
    }).catch(() => setTimeout(() => this.login(), 5000));
  }

  refresh () {
    if (!this.active) return;
    fetch(this.options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.authentication.token
      }
    }).then(response => {
      if (!this.status) return;
      else if (response.status === 401) this.login();
      else if (!response.ok) throw new Error();
      else return response.json().then(auth => this.onSuccess(auth));
    }).catch(() => setTimeout(() => this.refresh(), 5000));
  }

  onSuccess (auth) {
    if (!this.active) return;
    this.auth = auth;
    setTimeout(() => this.refresh(), (auth.expiration - Date.now()) / 2);
    if (this.options.enableEvents) network.connect({
      host: auth.network.host,
      token: auth.network.token,
    }).then(() => this.resolve(), error => this.abort(error));
    else this.resolve();
  }


}


module.exports = Runtime;
