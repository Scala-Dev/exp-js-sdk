'use strict';
/* jshint -W074 */

const _ = require('lodash');

const jwt = require('jsonwebtoken');
const EventNode = require('../utils/EventNode');

require('isomorphic-fetch');

const defaults = {};
    this._defaults = { host: 'https://api.goexp.io' };


class RuntimeContext {

  constructor (sdk) {
    this.sdk = sdk;
  }

  start (options) {
    this.status = true;
    let resolve, reject;
    this.promise = new Promise((a, b) => { resolve = a; reject = b });
    this.promise.resolve = resolve;
    this.promise.reject = reject;
    this.options = _.merge({}, defaults, options);
    Promise.resolve()
      .then(() => this.validate())
      .then(() => this.login())
      .catch(error => this.stop(error));
    return this.promise;
  }

  stop (error) {
    this.status = false;
    this.promise.reject(error || new Error('Runtime stopped.'));
    if (error) this.sdk.events.trigger('error', error);
    this.sdk.events.trigger('stop');
  }

  login () {
    if (!this.status) return;
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
    return fetch(this.options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.generateLoginPayload())
    }).then(response => this.onLoginResponse(response), () => this.queueLogin());
  }

  validate () {
    if (this.options.type === 'user') {
      if (!this.options.usename) throw new Error('Please specify the username.');
      if (!this.options.password) throw new Error('Please specify the password.');
      if (!this.options.organization) throw new Error('Please specify the organization.');
    } else if (this.options.type === 'device') {
      if (!this.options.uuid) throw new Error('Please specify the uuid.');
      if (!this.options.secret && !this.options.allowPairing) throw new Error('Please specify the device secret.');
    } else if (this.options.type === 'consumerApp') {
      if (!this.options.uuid) throw new Error('Please specify the uuid.');
      if (!this.options.apiKey) throw new Error('Please specify the apiKey');
    } else {
      throw new Error('Please specify authentication type (user/device/consumerApp).');
    }
  }

  generateLoginPayload () {
    
  }

}


class Runtime  {

  constructor (sdk) {
    this.sdk = sdk;
  }

  start (options) {
    if (this.context) this.context.stop();
    this.context = new RuntimeContext(this.sdk);
    this.context.start(options);
    return this.context.promise;
  }

  stop () {
    if (this.context) this.context.stop();
  }

  static clear () {
    clearTimeout(this.timeouts.queue);
    clearTimeout(this._queueLoginTimeout);
    clearTimeout(this._refreshTimeout);
  }

  login (promise) {
   
  }

  static _sendLoginRequest () {
   
  }

  

  static _onLoginResponse (id, response) {
    if (response.status === 401) return this._onAuthenticationFailure(id, response);
    if (!response.ok) {
      response.json().then(body => {
        this._events.trigger('error', body);
      });
      return this._queueLogin(id);
    }
    return this._onAuthResponse(id, response);
  }

  static _onAuthenticationFailure (id, response) {
    return response.json().then(body => {
      this._check(id);
      let error = new Error(body);
      this._events.trigger('error', error);
      this.stop();
      throw error;
    });
  }

  static _onAuthResponse (id, response) {
    return response.json().then(auth => this._update(id, auth));
  }

  static _queueLogin (id) {
    return new Promise((resolve, reject) => {
      this._queueLoginTimout = setTimeout(() => {
        Promise.resolve()
          .then(() => this._check(id))
          .then(() => this._login(id))
          .then(resolve, reject);
      }, 2000);
    });
  }

  static _refresh (id) {
    return this._sendRefreshRequest()
      .then(response => this._onRefreshResponse(id, response))
      .catch(() => this._queueRefresh(id));
  }

  static _sendRefreshRequest () {
    return fetch(this._options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      }
    });
  }

  static _onRefreshResponse (id, response) {
    if (response.status === 401) return this._queueLogin(id);
    if (!response.ok) return this._queueRefresh(id);
    return this._onAuthResponse(id, response);
  }

  static _queueRefresh (id) {
    return new Promise((resolve, reject) => {
      this._queueRefreshTimeout = setTimeout(() => {
        Promise.resolve()
          .then(() => this._check(id))
          .then(() => this._refresh(id))
          .then(resolve, reject);
      }, 2000);
    });
  }

  static _check (id) {
    if (id !== this._id) throw new Error('Startup was interrupted.');
  }

  static _update (id, auth) {
    this._check(id);
    this._clearTimeouts();
    this.auth = auth;
    this._refreshTimeout = setTimeout(() => this._refresh(id), (this.auth.expiration - Date.now()) / 2);
    this._events.trigger('update', auth);
  }

}

Runtime._initialize();

module.exports = Runtime;
