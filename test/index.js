'use strict';

const exp = require('../');

describe('Devices', () => {
  const sdk = exp.fork();
  before(() => require('./startup/device')(sdk));
  require('./runtime/authentication.spec')(sdk);
  require('./sanity.spec')(sdk);
  require('./api/sanity.spec')(sdk);

  after(() => sdk.stop());
});

describe('Users', () => {
  const sdk = exp.fork();
  before(() => require('./startup/user')(sdk));
  require('./runtime/authentication.spec')(sdk);
  require('./api/sanity.spec')(sdk);

  require('./sanity.spec')(sdk);
  after(() => sdk.stop());
});

describe('Consumer Apps', () => {
  const sdk = exp.fork();
  before(() => require('./startup/consumerApp')(sdk));
  require('./runtime/authentication.spec')(sdk);
  after(() => sdk.stop());
});

require('./regression/exp1511.spec')(exp);


describe('Runtime', () => {
  require('./runtime/clone.spec')(exp);
});

