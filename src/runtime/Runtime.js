'use strict';
/* jshint -W074 */

const _ = require('lodash');

const jwt = require('jsonwebtoken');
const EventNode = require('../utils/EventNode');

require('isomorphic-fetch');


class Runtime  {

  /* Public Methods */

  static start (options) {
    options = _.merge({}, this._defaults, options || {});
    return Promise.resolve()
      .then(() => Runtime.validate(options))
      .then(() => {
        if (this._id) this.stop();
        this._id = Math.random();
        this._options = options;
        this._events.trigger('start');
        return this._login(this._id);
      });
  }

  static stop () {
    this._id = null;
    this._options = null;
    this._auth = null;
    this._clearTimeouts();
    this._events.trigger('stop');
  }

  static on (name, callback, context) {
    return this._events.on(name, callback, context);
  }

  static clear (context) {
    this._events.clear(context);
  }

  static validate (options) {
    if (options.username) {
      if (!options.password) throw new Error('Please specify a password.');
      if (!options.organization) throw new Error('Please specify an organization.');
    } else if (options.deviceUuid || options.allowPairing) {
      if (!options.secret && !options.allowPairing) throw new Error('Please specify the device secret.');
    } else if (options.consumerAppUuid) {
      if (!options.apiKey) throw new Error('Please specify the api key.');
    } else {
      throw new Error('Please specify credentials.');
    }
  }

  /* Private Methods */

  static _initialize () {
    this._events = new EventNode();
    this._events.on('error', error => console.error(error), {});
    this._events.on('start', () => console.log('Runtime started.'));
    this._events.on('stop', () => console.log('Runtime stopped.'));
    this._events.on('update', () => console.log('Runtime authenticated.'));
    this._defaults = { host: 'https://api.goexp.io' };
  }

  static _clearTimeouts () {
    clearTimeout(this._queueRefreshTimeout);
    clearTimeout(this._queueLoginTimeout);
    clearTimeout(this._refreshTimeout);
  }

  static _login (id) {
    return this._sendLoginRequest()
      .then(response => this._onLoginResponse(id, response), this._queueLogin(id));
  }

  static _sendLoginRequest () {
    return fetch(this._options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this._generateLoginPayload())
    });
  }

  static _generateLoginPayload () {
    if (this._options.username) {
      return {
        type: 'user',
        username: this._options.username,
        password: this._options.password,
        organization: this._options.organization
      };
    } else if (this._options.deviceUuid || this._options.allowPairing) {
      return {
        token: jwt.sign({
          type: 'device',
          uuid: this._options.deviceUuid,
          allowPairing: this._options._allowPairing,
        }, this._options.secret || 'secret')
      };
    } else if (this._options.consumerAppUuid) {
      return {
        token : jwt.sign({
          type: 'consumerApp',
          uuid: this._options.consumerAppUuid,
        }, this._options.apiKey)
      };
    }
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
      }, 5000);
    });
  }

  static _refresh (id) {
    return this._sendRefreshRequest()
      .then(response => this._onRefreshResponse(id, response), this._queueRefresh(id));
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
      }, 5000);
    });
  }

  static _check (id) {
    if (id !== this._id) throw new Error('Startup was interrupted.');
  }

  static _update (id, auth) {
    this._check(id);
    this._clearTimeouts();
    this.auth = auth;
    this._refreshTimeout = setTimeout(() => this._refresh(this.id), (this.auth.expiration * 1000 - Date.now()) / 2);
    this._events.trigger('update', auth);
  }

}

Runtime._initialize();

module.exports = Runtime;