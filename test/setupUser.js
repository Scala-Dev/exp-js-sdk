'use strict';

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