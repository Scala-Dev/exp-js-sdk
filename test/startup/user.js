'use strict';

module.exports = exp => {
  exp.start({
    username: process.env.EXP_TEST_USERNAME,
    password: process.env.EXP_TEST_PASSWORD,
    organization: process.env.EXP_TEST_ORGANIZATION,
    host: 'http://localhost:9000'
  });
};