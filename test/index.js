'use strict';

const exp = require('../');

describe('Users', () => {
  const sdk = exp.fork();
  before(() => require('./startup/user')(sdk));
  require('./runtime/authentication.spec')(sdk);

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
require('./runtime/clone.spec')(exp);
require('./runtime/fork.spec')(exp);

