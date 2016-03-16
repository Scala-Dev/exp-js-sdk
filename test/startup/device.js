'use strict';

module.exports = exp => {
  exp.start({
  	uuid: 'test-uuid',
  	secret: 'test-secret',
  	host: 'http://localhost:9000'
  });
};