'use strict';

module.exports = class Context {
  constructor () {
    this.sdk = {
      init: require('../init'),
      config: require('../config'),
      api: require('../api'),
      connection: require('../connection'),
      channels: require('../channels'),
      utilities: require('../utilities'), // Deprecate for lib
      lib: require('../utilities'),
      runtime: require('../runtime')
    };
  }

  clear () {
    // Remove all listeners and clean up.
    console.info('(STUB) Cleaning up context.');
  }

};
