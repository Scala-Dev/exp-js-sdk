'use strict';
/* jshint -W074 */

const _ = require('lodash');
const jwt = require('jsonwebtoken');

require('isomorphic-fetch');

const SdkError = require('../lib/SdkError');
const Component = require('../lib/Component');
const ComponentProxy = require('../lib/ComponentProxy');






const defaultOptions = {
  authHost: 'https://api.exp.scala.com'
};

class Runtime extends Component {

  constructor () {
    this.id = Math.random();
    this.options = null;
    this.auth = null;
    super(arguments);
  }

  refresh () {
    // Get refresh token from current token.
    // If id matches and request was successful, resolve and trigger "refresh" event, otherwise reject.
  }

  login () {
    // 
  }


  static validate (options) {
    if (options.username) {
      if (!options.password) throw new SdkError('passwordMissing');
      if (!options.organization) throw new SdkError('organizationMissing');
    } else if (options.deviceUuid) {
      if (!options.secret) throw new SdkError('secretMissing');
    } else if (options.consumerAppUuid) {
      if (!options.apiKey) throw new SdkError('apiKeyMissing');
    } else if (!options.token) {
      throw new SdkError('credentialsMissing');
    } 
  }

  update (auth) {
    if (!this.auth) this.events.trigger('authenticated', this.auth);
    this.events.trigger('update', this.auth);
    this.auth = auth;
    // TODO: Use given token expiry. Waiting on API.
    this.tokenRefreshTimeout = setTimeout(() => this.refresh(), 3600);
  }

  start (options) {
    this.stop();
    this.options = options;
    this.events.trigger('start');
    if (this.options.token) return this.refresh();
    return this.login();
  }

  stop () {   
    this.id = Math.random();
    this.options = null;
    this.auth = null;
    clearTimeout(this.tokenRefreshTimeout);
    this.events.trigger('stop');
  }

}


class Proxy extends ComponentProxy {

  start (options) {
    options = _.merge({}, defaultOptions, options || {});
    return Promise.resolve()
      .then(() => Runtime.validate(options))
      .then(() => this._component.start(options));
  }

  stop () {
    return Promise.resolve()
      .then(() => this._component.stop());
  }

}


module.exports = new Runtime(Proxy);



class RuntimeProxy extends Component {

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this._getLoginPayload(context))
    });
  }


  get token () {
    if (sharedContext) return sharedContext.token;
    return '';
  }

};
