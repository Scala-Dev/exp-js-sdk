'use strict';
/* jshint -W074 */

const jwt = require('jsonwebtoken');

class Authenticator {

  constructor (sdk) {
    this._sdk = sdk;
    this._auth = null;
    this._promise = null;
    this._resolve = null;
    this._reject = null;
    this._reset();
    this._lastAuth = null;
  }

  start () {
    this._login();
    return this._promise;
  }

  stop () {
    this._auth = null;
    this._reset();
  }

  getAuthSync () {
    return this._auth || this._lastAuth;
  }

  getAuth () {
    return this._promise;
  }

  on (name, callback, context) {
    return this._sdk.events.on(name, callback, context);
  }

  _onSuccess (auth) {
    this._reset();
    this._timeout = setTimeout(() => this._refresh(), (auth.expiration - Date.now()) / 2);
    this._auth = auth;
    this._resolve(auth);
    this._sdk.events.trigger('update', auth);
  }

  _reset () {
    clearTimeout(this._timeout);
    if (!this._auth && this._promise) return;
    this._lastAuth = this._auth;
    this._auth = null;
    this._promise = new Promise((resolve, reject) => { this._resolve = resolve; this._reject = reject; });
  }

  _onError (error) {
    this._reset();
    console.warn(error);
  }

  _onFatal (error) {
    this._reset();
    this._reject(error);
    this._sdk.events.trigger('error', error);
  }


  _login () {
    this._reset();
    const options = this._sdk.options;
    let payload = {};
    if (options.type === 'user') {
      payload = { type: 'user', username: options.username, password: options.password, organization: options.organization };
    } else if (options.type === 'device') {
      payload = { token: jwt.sign({ type: 'device', uuid: options.uuid, allowPairing: options.allowPairing }, options.secret || '_') };
    } else if (options.type === 'consumerApp') {
      payload = { token : jwt.sign({ type: 'consumerApp', uuid: options.uuid }, options.apiKey) };
    }
    fetch(options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(response => {
      if (response.status === 401) this._onFatal(new Error('Authentication failed. Please check your credentials.'));
      else if (!response.ok) throw new Error();
      else return response.json().then(auth => this._onSuccess(auth));
    }).catch(error => {
      this._onError(error);
      this._timeout = setTimeout(() => this._login(), 5000);
    });
  }

  _refresh () {
    this._reset();
    fetch(this._sdk.options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      }
    }).then(response => {
      if (response.status === 401) this._login();
      else if (!response.ok) throw new Error();
      else return response.json().then(auth => this._update(auth));
    }).catch(error => {
      this._onError(error);
      this._timeout = setTimeout(() => this._refresh(), 5000);
    });
  }


}

module.exports = Authenticator;
