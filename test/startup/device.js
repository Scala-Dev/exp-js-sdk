'use strict';

module.exports = exp => {
  exp.start({ uuid: 'test-device', secret: 'test-secret', host: 'http://localhost:9000' });
};