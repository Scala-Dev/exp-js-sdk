'use strict';

const optionsManager = require('./optionsManager');
const authManager = require('./authManager');
const networkManager = require('./networkManager');

class Runtime {

  static start (options) {
    return optionsManager.set(options).then(options => {
      return authManager.start(options).then(() => {
        if (options.enableEvents) return networkManager.start();
      });
    });
  }

  static stop () {
    authManager.stop();
    networkManager.stop();
  }

}

module.exports = Runtime;
