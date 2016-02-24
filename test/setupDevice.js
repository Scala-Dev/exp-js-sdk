'use strict';

const exp = require('../');

before(() => {
  return exp.start({
    type: 'device',
    uuid: '7ff0874b-0174-4d1e-93ac-ac253b85be02',
    secret: 'b9bfd289479cdeffa15cf9981aeb8970e845fdf4e36aabcfa80e0ddbaef2e49051dcee49a7947e51e14967f1ca52a7f2',
    host: 'http://localhost:9000'
  });
});

after(() => {
  exp.stop();
});