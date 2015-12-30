'use strict';

const exp = require('../');

before(() => {
  return new Promise((resolve, reject) => {
    exp.network.on('online', () => {
      resolve();
    });
    return exp.runtime.start({
      allowPairing: true,
      host: 'http://localhost:9000'
    }).catch(error => {
      reject(error);
    });
  });
});

after(() => {
  exp.runtime.stop();
});