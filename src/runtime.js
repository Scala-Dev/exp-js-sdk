'use strict';
/* jshint -W074 */

const _ = require('lodash');
const jwt = require('jsonwebtoken');

require('isomorphic-fetch');

const defaults = {
  host: 'https://api.goexp.io',
  enableEvents: true
};


const events = require('./events');
const config = require('./config');
const network = require('./network');


class Runtime {

  start (options) {
    const pid = Math.random();
    if (config.pid) this.stop();
    config.pid = pid;
    config.options = _.merge(_.merge({}, defaults), options);
    network.disconnect();
    events.trigger('start');
    this.promise = new Promise((a, b) => { this.resolve = a; this.reject = b });
    try { this.validate(pid); }
    catch (error) { this.abort(error); }
    this.login(pid);
    return this.promise;
  }

  abort (error) {
    events.trigger('error', error);
    this.reject(error);
    this.stop();
  }

  stop (pid) {
    if (pid !== config.pid) return;
    config.pid = null;
    config.options = null;
    config.auth = null;
    events.trigger('stop');
    this.reject(new Error('Runtime stopped.'));
  }

  validate (pid) {
    if (pid !== config.pid) return;
    if (config.options.type === 'user') {
      if (!config.options.username) throw new Error('Please specify the username.');
      if (!config.options.password) throw new Error('Please specify the password.');
      if (!config.options.organization) throw new Error('Please specify the organization.');
    } else if (config.options.type === 'device') {
      if (!config.options.uuid) throw new Error('Please specify the uuid.');
      if (!config.options.secret && !config.options.allowPairing) throw new Error('Please specify the device secret.');
    } else if (config.options.type === 'consumerApp') {
      if (!config.options.uuid) throw new Error('Please specify the uuid.');
      if (!config.options.apiKey) throw new Error('Please specify the apiKey');
    } else {
      throw new Error('Please specify authentication type.');
    }
  }

  login (pid) {
    if (pid !== config.pid) return;
    let payload;
    if (config.options.type === 'user') {
      payload = {
        type: 'user',
        username: config.options.username,
        password: config.options.password,
        organization: config.options.organization
      };
    } else if (config.options.type === 'device') {
      payload = {
        token: jwt.sign({
          type: 'device',
          uuid: config.options.uuid,
          allowPairing: config.options.allowPairing,
        }, config.options.secret || '_')
      };
    } else if (config.options.type === 'consumerApp') {
      payload = {
          token : jwt.sign({
          type: 'consumerApp',
          uuid: config.options.uuid,
        }, config.options.apiKey)
      };
    }
    fetch(config.options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(response => {
      if (pid !== config.pid) return;
      else if (response.status === 401) return this.abort(new Error('Authentication failed. Please check your credentials.'));
      else if (!response.ok) throw new Error();
      return response.json().then(auth => this.onSuccess(pid, auth));
    }).catch(() => setTimeout(() => this.login(pid), 5000));
  }

  refresh (pid) {
    if (pid !== config.pid) return;
    fetch(config.options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + config.auth.token
      }
    }).then(response => {
      if (!this.status) return;
      else if (response.status === 401) this.login(pid);
      else if (!response.ok) throw new Error();
      else return response.json().then(auth => this.onSuccess(pid, auth));
    }).catch(() => setTimeout(() => this.refresh(pid), 5000));
  }

  onSuccess (pid, auth) {
    if (pid !== config.pid) return;
    setTimeout(() => this.refresh(pid), (auth.expiration - Date.now()) / 2);
    config.auth = auth;
    events.trigger('authenticated');
    if (!config.options.enableEvents) return this.resolve();
    network.connect(auth.network.host, auth.token, {}).then(this.resolve);
  }


}


module.exports = new Runtime();
