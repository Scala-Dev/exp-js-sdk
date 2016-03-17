'use strict';

module.exports = suite => {
  describe('exp.start(options)', () => {
    describe('Using Valid Credentials', () => {
      Object.keys(suite.credentials).forEach(name => {
        it(`Should resolve for ${ name } credentials.`, () => suite.exp.start(suite.credentials[name]));
      });
    });
  });
};



