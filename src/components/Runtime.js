'use strict';

const _ = require('lodash');
const jwt = require('jsonwebtoken');

require('isomorphic-fetch');

const EventNode = require('../lib/EventNode');
const SdkError = require('../lib/SdkError');

const runtimes = [];

const defaultOptions = {
  authHost: 'https://api.exp.scala.com'
};

let sharedContext;
let refreshInterval;

module.exports = class Runtime {

  constructor () {
    this._events = new EventNode();
    this.on = this._events.on;
    runtimes.push(this);
  }

  start (options) {
    const context = {};
    context.options = _.merge({}, defaultOptions, options || {});
    return Promise.resolve()
      .then(() => this._validateContext(context))
      .then(() => {
        sharedContext = context;
        if (context.options.token) {
          context.token = context.options.token;
          return this._refresh(context);
        } else {
          return this._login(context);
        }
      })
      .then(() => {
        clearInterval(refreshInterval);
        refreshInterval = setInterval(() => {
          if (!sharedContext) return;
          this._refresh(sharedContext);
        }, 5000);
        this._trigger('start');
      });
  }

  stop () {
    clearInterval(refreshInterval);
    if (!sharedContext) return;
    sharedContext = null;
    this._trigger('stop');
  }

  _validateContext (context) {
    if (context.options.username) {
      return this._validateUserContext(context);
    } else if (context.options.deviceUuid) {
      return this._validateDeviceContext(context);
    } else if (context.options.consumerAppUuid) {
      return this._validateConsumerAppOptions(context);
    } else if (!context.options.token) {
      throw new SdkError('credentialsMissing');
    } else {
      return null;
    }
  }

  _validateUserContext (context) {
    if (!context.options.password) throw new SdkError('passwordMissing');
    if (!context.options.organization) throw new SdkError('organizationMissing');
  }

  _validateDeviceOptions (context) {
    if (!context.options.secret) throw new SdkError('secretMissing');
  }

  _validateConsumerAppOptions (context) {
    if (!context.options.apiKey) throw new SdkError('apiKeyMissing');
  }

  _abort (error) {
    this.stop();
    this._trigger('error', error);
  }

  _trigger (name, payload) {
    runtimes.forEach(runtime => {
      runtime._events.trigger(name, payload);
    });
  }

  _checkContext (context) {
    if (context === sharedContext) return true;
    throw new SdkError('runtimeInterrupted');
  }

  _refresh (context) {
    const locals = {};
    return this._sendRefreshRequest(context)
      .then(response => locals.response = response)
      .then(() => locals.response.json())
      .then(body => locals.body = body)
      .then(() => {
        this._checkContext(context);
        if (locals.response.status === 401) {
          const error = new SdkError('authenticationFailed');
          this._abort(error);
          throw error;
        } else if (!locals.response.ok) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              try {
                this._checkContext(context);
              } catch (error) {
                return reject(error);
              }
              return this._refresh(context).then(resolve).catch(reject);
            }, 5000);
          });
        } else {
          context.token = locals.body.token;
          this._trigger('refresh');
          return null;
        }
      });
  }

  _login (context) {
    const locals = {};
    return this._sendLoginRequest(context)
      .then(response => locals.response = response)
      .then(() => locals.response.json())
      .then(body => locals.body = body)
      .then(() => {
        this._checkContext(context);
        if (locals.response.status === 401) {
          const error = new SdkError('authenticationFailed');
          this._abort(error);
          throw error;
        } else if (!locals.response.ok) {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              try {
                this._checkContext(context);
              } catch (error) {
                return reject(error);
              }
              return this._login(context).then(resolve).catch(reject);
            }, 5000);
          });
        } else {
          context.token = locals.body.token;
          this._trigger('refresh');
          return null;
        }
      });
  }

  _getLoginPayload (context) {
    if (context.options.username) {
      return this._getUserLoginPayload(context);
    } else if (context.options.deviceUuid) {
      return this._getDeviceLoginPayload(context);
    } else if (context.options.consumerAppUuid) {
      return this._getConsumerAppLoginPayload(context);
    } else {
      return {};
    }
  }

  _getUserLoginPayload (context) {
    return {
      username: context.options.username,
      password: context.options.password,
      organization: context.options.organization
    };
  }

  _getDeviceLoginPayload (context) {
    const token = jwt.sign({
      deviceUuid: context.options.deviceUuid,
      allowPairing: context.options.allowPairing
    }, context.options.secret);
    return { token: token };
  }

  _getConsumerAppLoginPayload (context) {
    const token = jwt.sign({
      consumerAppUuid: context.options.consumerAppUuid
    }, context.options.apiKey);
    return { token: token };
  }

  _sendLoginRequest (context) {
    return fetch(context.options.authHost + '/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this._getLoginPayload(context))
    });
  }


  get token () {
    if (sharedContext) return sharedContext.token;
    return '';
  }

};
