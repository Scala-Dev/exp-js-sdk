'use strict';
/* jshint -W074 */

const _ = require('lodash');
const jwt = require('jsonwebtoken');

require('isomorphic-fetch');

const defaults = {
  host: 'https://api.goexp.io',
  enableEvents: true
};

let pid = Math.random();

class Runtime {

  constructor (sdk) {
    this.sdk = sdk;
  }

  start (options) {
    pid = Math.random();
    this.stop();
    this.pid = pid;
    this.sdk.options = _.merge(_.merge({}, defaults), options);
    this.sdk.network.disconnect();
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
    this.sdk.options = null;
    this.sdk.auth = null;
    if (!this.pid) return;
    this.sdk.events.trigger('stop');
    this.reject(new Error('Runtime stopped.'));
  }

  validate () {
    if (this.sdk.options.type === 'user') {
      if (!this.sdk.options.username) throw new Error('Please specify the username.');
      if (!this.sdk.options.password) throw new Error('Please specify the password.');
      if (!this.sdk.options.organization) throw new Error('Please specify the organization.');
    } else if (this.sdk.options.type === 'device') {
      if (!this.sdk.options.uuid) throw new Error('Please specify the uuid.');
      if (!this.sdk.options.secret && !this.sdk.options.allowPairing) throw new Error('Please specify the device secret.');
    } else if (this.sdk.options.type === 'consumerApp') {
      if (!this.sdk.options.uuid) throw new Error('Please specify the uuid.');
      if (!this.sdk.options.apiKey) throw new Error('Please specify the apiKey');
    } else {
      throw new Error('Please specify authentication type.');
    }
  }

  login () {
    if (this.pid !== pid) return;
    let payload;
    if (this.sdk.options.type === 'user') {
      payload = {
        type: 'user',
        username: this.sdk.options.username,
        password: this.sdk.options.password,
        organization: this.sdk.options.organization
      };
    } else if (this.sdk.options.type === 'device') {
      payload = {
        token: jwt.sign({
          type: 'device',
          uuid: this.sdk.options.uuid,
          allowPairing: this.sdk.options.allowPairing,
        }, this.sdk.options.secret || '_')
      };
    } else if (this.sdk.options.type === 'consumerApp') {
      payload = {
          token : jwt.sign({
          type: 'consumerApp',
          uuid: this.sdk.options.uuid,
        }, this.sdk.options.apiKey)
      };
    }
    fetch(this.sdk.options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(response => {
      if (this.pid !== pid) return;
      else if (response.status === 401) return this.abort(new Error('Authentication failed. Please check your credentials.'));
      else if (!response.ok) throw new Error();
      return response.json().then(auth => this.onSuccess(auth));
    }).catch(() => setTimeout(() => this.login(), 5000));
  }

  refresh () {
    if (this.pid !== pid) return;
    fetch(this.sdk.options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      }
    }).then(response => {
      if (!this.status) return;
      else if (response.status === 401) this.login();
      else if (!response.ok) throw new Error();
      else return response.json().then(auth => this.onSuccess(auth));
    }).catch(() => setTimeout(() => this.refresh(), 5000));
  }

  onSuccess (auth) {
    if (this.pid !== pid) return;
    this.sdk.events.trigger('authenticated', auth);
    this.sdk.auth = auth;
    setTimeout(() => this.refresh(), (auth.expiration - Date.now()) / 2);
    if (this.sdk.options.enableEvents) this.sdk.network.connect(auth.network.host, auth.token, {}).then(() => this.resolve(), error => this.abort(error));
    else this.resolve();
  }


}


module.exports = Runtime;
