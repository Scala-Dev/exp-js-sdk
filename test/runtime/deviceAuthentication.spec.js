'use strict';

describe('Device Authentication', exp => {
  const sdk = exp.fork();
  before(() => require('../startup/device')(sdk));
  require('./authentication.spec')(sdk);
  after(() => sdk.stop());
})