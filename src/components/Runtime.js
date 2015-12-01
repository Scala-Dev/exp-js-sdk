'use strict';

const jwt = require('jsonwebtoken');
require('isomorphic-fetch');

const lib = require('../lib');
const socket = require('../socket');

const runtimes = [];
const shared = {};

let resolve_;
let reject_;

module.exports = class Runtime {

  constructor () {
    this._events = new lib.EventNode();
    this.on = this.events.on;
    runtimes.push(this);
  } 

  start (options) {    
    return new Promise((resolve, reject) => {
      resolve_ = resolve;
      reject_ = reject;
      this._validateOptions(options);
      this.stop();
      shared = {};
      shared.options = options || {};
      if (shared.options.token) shared.token = shared.options.token;
      this.refresh();
    });
  }

  static _validateOptions (options) {
    if (options.username) {
      this._validateUserOptions();
    } else if (options.deviceUuid) {
      this._validateDeviceOptions();
    } else if (options.consumerAppUuid) {
      this._validateConsumerAppOptions();
    } else if (!options.token) {
      throw new Error('Please specify user, device, or consumer app credentials.');
    } 
  }

  static _validateUserOptions (options) {
    if (!options.password) throw new Error('Please specify a password.');
    if (!options.org) throw new Error('Please specify an org.');    
  }
  
  static _validateDeviceOptions (options) {
    if (!options.secret) throw new Error('Please specify a secret');
  }

  static _validateConsumerAppOptions (options) {
    if (!options.apiKey) throw new Error('Please specify an api key.');
  }

  
  refresh () {
    if (shared.token) {
      this._refreshToken();
    } else {
      this._login();
    }
  }
    
  _refreshToken () {
    // Stub: Token refresh.
    shared.token = null;
    this._login();
  }

  get host () {
    return shared.options.host || 'https://api.exp.scala.com';
  }
  
  get token () {
    return shared.token || '';
  }



  stop () {

  }


  _login () {
    const payload = this._getLoginPayload();
    return fetch(this.host + '/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          // FATAL, STOP THE RUNTIME. REJECT THE PROMISE.
        } 
        return setTimeout(() => this._login(), 5000);
      }
      return response.json().then(body => {
        // Alert of new token and stuff!
        shared.token = body.token;
      });
    }).catch(() => {
      setTimeout(() => this._login(), 5000);
    });
  }

  _getLoginPayload () {
    if (shared.options.username) {
      return this._getUserAuthPayload();
    } else if (shared.options.deviceUuid) {
      return this._getDeviceAuthPayload();
    } else if (shared.options.consumerAppUuid) {
      return this._getConsumerAppAuthPayload();
    } else {
      return {};
    }
  }

  _getUserLoginPayload () {
    return { 
      username: shared.options.username,
      password: shared.options.password,
      org: shared.options.org 
    };
  }

  _getDeviceLoginPayload () {
    const token = jwt.sign({ 
      deviceUuid: shared.options.deviceUuid, 
      allowPairing: shared.options.allowPairing
    }, shared.options.secret);
    return { token: token };
  }

  _getConsumerAppLoginPayload () {
    const token = jwt.sign({
      consumerAppUuid: shared.options.consumerAppUuid
    }, shared.options.apiKey);
    return { token: token };
  }

  _sendLoginRequest () {
    

  }

};

socket.events.on('online', () => {
  runtimes.forEach(runtime => {
    runtime._events.trigger('online');
  });
});

socket.events.on('offline', () => {
  runtimes.forEach(runtime => {
    runtime._events.trigger('offline');
  });
});
