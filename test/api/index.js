'use strict';

module.exports = exp => {
  describe('API', () => {
    describe('Sanity Tests', () => {
      require('./sanity')(exp);
    });
  });
}