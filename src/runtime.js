'use strict';
/* jshint -W074 */

const jwt = require('jsonwebtoken');
const EventNode = require('event-node');


class Runtime extends EventNode {

  constructor () {
    super();
    this.auth = null;
  }

  start (options) {
    this.options = options;
    this.login();
  }

  getLoginPayload () {
    if (this.options.type === 'user') {
      return {
        type: 'user',
        username: this.options.username,
        password: this.options.password,
        organization: this.options.organization
      };
    } else if (this.options.type === 'device') {
      return {
        token: jwt.sign({
          type: 'device',
          uuid: this.options.uuid,
          allowPairing: this.options.allowPairing,
        }, this.options.secret || '_')
      };
    } else if (this.options.type === 'consumerApp') {
      return {
        token : jwt.sign({
          type: 'consumerApp',
          uuid: this.options.uuid,
        }, this.options.apiKey)
      };
    }
  }

  login () {
    fetch(this.options.host + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.getLoginPayload())
    }).then(response => {
      if (response.status === 401) return this.trigger('error', new Error('Authentication failed.'));
      else if (!response.ok) throw new Error();
      return response.json().then(auth => this.update(auth));
    }).catch(() => setTimeout(() => this.login(), 5000));
  }

  refresh () {
    fetch(this.options.host + '/api/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.auth.token
      }
    }).then(response => {
      if (response.status === 401) this.login();
      else if (!response.ok) throw new Error();
      else return response.json().then(auth => this.update(auth));
    }).catch(() => setTimeout(() => this.refresh(), 5000));
  }

  update (auth, id) {
    setTimeout(() => this.refresh(id), (auth.expiration - Date.now()) / 2);
    this.auth = auth;
    this.trigger('update', auth);
    if (this.options.enableEvents) this.network.connect(this.auth);
  }

}

module.exports = new Runtime();
