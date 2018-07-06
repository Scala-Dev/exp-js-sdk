'use strict';
/* jshint -W074 */

const jsrsasign = require('jsrsasign');

class Authenticator {

  constructor (sdk) {
    this._sdk = sdk;
    this._auth = null;
    this._promise = null;
    this._resolve = null;
    this._reject = null;
    this._reset();
    this._lastAuth = null;
    this._id = Math.random();
  }

  start () {
    if (this._sdk.options.auth) {
      this._reset();
      setTimeout(() => this._onSuccess(this._sdk.options.auth));
    } else this._login();
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
    if (this._sdk.options.mode !== 'standalone') {
      this._timeout = setTimeout(() => this._refresh(), (auth.expiration - Date.now()) / 2);
    }
    this._auth = auth;
    this._lastAuth = auth;
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
    if (this._sdk.options.mode === 'standalone') {
      return setTimeout(this._onSuccess(this._sdk.options.documents.auth));
    }

    this._reset();
    const options = this._sdk.options;
    let payload = {};
    if (options.type === 'user') {
      payload = { type: 'user', username: options.username, password: options.password, organization: options.organization };
    } else if (options.type === 'device') {
      payload = { token: this._sign({ type: 'device', uuid: options.uuid, allowPairing: options.allowPairing }, options.secret || '_') };
    } else if (options.type === 'consumerApp') {
      payload = { token : this._sign({ type: 'consumerApp', uuid: options.uuid }, options.apiKey) };
    } else if (options.type === 'direct') {
      return this._onFatal(new Error('Authentication payload is no longer valid and no credentials available to login again.'));
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

  _sign (payload, secret) {
    const header = {};
    header.alg = 'HS256';
    header.typ = 'JWT';
    const body = {};
    Object.keys(payload).forEach(k => body[k] = payload[k]);
    body.iat = Math.round(Date.now() / 1000);
    body.exp = body.iat + 86400;
    const sheader = JSON.stringify(header);
    const sbody = JSON.stringify(body);
    return jsrsasign.jws.JWS.sign('HS256', sheader, sbody, { rstr: secret });
  }

  _refresh () {

    if (this._sdk.options.mode === 'standalone') {
      return setTimeout(this._onSuccess(this._sdk.options.documents.auth));
    }

    fetch(this._sdk.options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this._lastAuth.token
      }
    }).then(response => {
      if (response.status === 401) this._login();
      else if (!response.ok) throw new Error();
      else return response.json().then(auth => {
        this._onSuccess(auth)
      });
    }).catch(error => {
      this._timeout = setTimeout(() => this._refresh(), 60000);
    });

  }

}

module.exports = Authenticator;
