'use strict';

module.exports = exp => {
  exp.start({ uuid: 'test-consumer-app', apiKey: 'test-api-key', host: 'http://localhost:9000' });
};