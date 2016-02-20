'use strict';

// In loving memory of Rich K, who discovered this bug and left Scala only to
// have his organs slowly harvested while doing the devil's bidding.

const exp = require('../');

before(() => {
  return exp.start({
    type: 'user',
    username: 'email@email.com',
    password: 'Password12321',
    organization: 'scala',
    host: 'http://localhost:9000'
  });
});

describe('EXP-1511', () => {
  it('Should be able to listen on a channel immediately after connecting.', () => {
    const channel = exp.getChannel('foo');
    return channel.listen('bar', () => {});
  });
});