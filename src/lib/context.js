'use strict';

module.exports = class Context {
  constructor () {
    const Runtime = require('../runtime');
    this.sdk = {
      config: require('../config'),
      api: require('../api'),
      connection: require('../connection'),
      channels: require('../channels'),
      utilities: require('./index'), // Deprecate for lib
      lib: require('./index'),
      runtime: new Runtime()
    };
  }

  clear () {
    // Remove all listeners and clean up.
    console.info('(STUB) Cleaning up context.');
  }

};
