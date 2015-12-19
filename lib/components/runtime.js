'use strict';
/* jshint -W074 */

const _ = require('lodash');
const jwt = require('jsonwebtoken');

require('isomorphic-fetch');

const SdkError = require('../utils/SdkError');
const ApiError = require('../utils/ApiError');
const Component = require('../utils/Component');
const ComponentDelegate = require('../utils/ComponentDelegate');

const defaultOptions = {
  host: 'https://api.exp.scala.com'
};

class Runtime extends Component {

  constructor (Delegate) {
    super(Delegate);
    this.id = null;
    this.options = null;
    this.config = {};
  }

  refresh (id) {
    return fetch(this.options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      }
    }).catch(error => {
      this.events.trigger('warning', error);
      return null;
    }).then(response => {
      if (!response) return this.queueRefresh(id);
      return response.json().then(body => {
        this.check(id);
        if (response.status >= 400) {
          let error = new ApiError({
            status: response.status,
            code: body.code,
            message: body.message
          });
          if (response.status === 401) {
            if (this.options.username || this.options.deviceUuid || this.options.consumerAppUuid) {
              return this.queueLogin(id);
            }
            this.events.trigger('error', error);
            this.stop();
            throw error;
          } else {
            this.events.trigger('warning', error);
          }
          return this.queueRefresh(id);
        }
        this.check(id);
        return this.update(body);
      });
    });
  }

  login (id) {
    let payload = {};
    if (this.options.username) {
      payload.username = this.options.username;
      payload.password = this.options.password;
      payload.organization = this.options.organization;
    } else if (this.options.deviceUuid || this.options.allowPairing) {
      payload.token = jwt.sign({
        deviceUuid: this.options.deviceUuid || '',
        allowPairing: this.options.allowPairing
      }, this.options.secret || 'secret');
    } else if (this.options.consumerAppUuid) {
      payload.token = jwt.sign({
        consumerAppUuid: this.options.consumerAppUuid
      }, this.options.apiKey);
    }
    return fetch(this.options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(error => {
      this.events.trigger('error', new SdkError({ error: error }));
      return null;
    }).then(response => {
      if (!response) return this.queueLogin(id);
      return response.json().then(body => {
        this.check(id);
        if (response.status >= 400) {
          let error = new ApiError({
            status: response.status,
            code: body.code,
            message: body.message
          });
          if (response.status === 401) {
            this.events.trigger('error', error);
            this.stop();
            throw new SdkError(body);
          } else {
            this.events.trigger('warning', error);
          }
          return this.queueLogin(id);
        }
        this.check(id);
        return this.update(body);
      });
    });
  }

  queueLogin (id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Promise.resolve()
          .then(() => this.check(id))
          .then(() => this.login(id))
          .then(resolve).catch(reject);
      }, 5000);
    });
  }

  queueRefresh (id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        Promise.resolve()
          .then(() => this.check(id))
          .then(() => this.refresh(id))
          .then(resolve).catch(reject);
      }, 5000);
    });
  }

  check (id) {
    if (id !== this.id) throw new SdkError('startupInterupted');
  }

  static validate (options) {
    if (options.username) {
      if (!options.password) throw new SdkError('passwordMissing');
      if (!options.organization) throw new SdkError('organizationMissing');
    } else if (options.deviceUuid || options.allowPairing) {
      if (!options.secret && !options.allowPairing) throw new SdkError('secretMissing');
    } else if (options.consumerAppUuid) {
      if (!options.apiKey) throw new SdkError('apiKeyMissing');
    } else if (!options.token) {
      throw new SdkError('credentialsMissing');
    }
  }

  update (auth) {
    this.clearTimeouts();
    this.auth = auth;
    this.refreshTimeout = setTimeout(() => this.refresh(this.id), (this.auth.exp * 1000 - Date.now()) / 2);
    this.events.trigger('update', auth);
  }

  start (options) {
    options = _.merge({}, defaultOptions, options || {});
    return Promise.resolve()
      .then(() => this.constructor.validate(options))
      .then(() => this.stop())
      .then(() => {
        this.id = Math.random();
        this.options = options;
        this.events.trigger('start');
        if (this.options.token) return this.refresh(this.id);
        return this.login(this.id);
      });
  }

  clearTimeouts () {
    clearTimeout(this.queueRefreshTimeout);
    clearTimeout(this.queueLoginTimeout);
    clearTimeout(this.refreshTimeout);
  }

  stop () {
    return Promise.resolve()
      .then(() => {
        if (this.id) this.events.trigger('stop');
        this.clearTimeouts();
        this.id = null;
        this.options = null;
        this.auth = null;
      });
  }

}


class Delegate extends ComponentDelegate {

  start (options) {
    return this._component.start(options);
  }

  stop () {
    return this._component.stop();
  }

  get config () { return this._component.config; }

}

const runtime = new Runtime(Delegate);
runtime.events.on('warning', warning => console.warn(warning), {});
runtime.events.on('error', error => console.error(error), {});
runtime.events.on('start', () => console.log('Runtime started.'));
runtime.events.on('stop', () => console.log('Runtime stopped.'));
runtime.events.on('auth', () => console.log('Runtime authenticated.'));
module.exports = runtime;
