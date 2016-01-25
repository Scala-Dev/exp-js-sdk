'use strict';
/* jshint -W074 */

const _ = require('lodash');

const defaults = {
  host: 'https://api.goexp.io',
  enableEvents: true
};

class OptionsManager {

  constructor () {
    this.status = false;
    this.promise = new Promise(resolve => this.resolve = resolve);
  }

  set (options_) {
    if (this.status) return Promise.reject(new Error('Options already set.'));
    const options = _.merge(_.merge({}, defaults), options_);
    try { this.constructor.validate(options); }
    catch (error) { return Promise.reject(error); }
    this.resolve(options);
    return Promise.resolve(options);
  }

  get () { return this.promise; }

  static validate (options) {
    if (options.type === 'user') {
      if (!options.username) throw new Error('Please specify the username.');
      if (!options.password) throw new Error('Please specify the password.');
      if (!options.organization) throw new Error('Please specify the organization.');
    } else if (options.type === 'device') {
      if (!options.uuid && !options.allowPairing) throw new Error('Please specify the uuid.');
      if (!options.secret && !options.allowPairing) throw new Error('Please specify the device secret.');
    } else if (options.type === 'consumerApp') {
      if (!options.uuid) throw new Error('Please specify the uuid.');
      if (!options.apiKey) throw new Error('Please specify the apiKey');
    } else {
      throw new Error('Please specify authentication type.');
    }
  }

}

module.exports = new OptionsManager();