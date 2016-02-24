'use strict';

const exp = require('../');

before(() => {
  return exp.start({
    type: 'device',
    allowPairing: true,
    host: 'http://localhost:9000'
  });
});

after(() => {
  exp.stop();
});