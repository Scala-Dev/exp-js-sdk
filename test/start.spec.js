'use strict';

module.exports = suite => {
  describe('EXP.start(options)', () => {
    describe('Using Valid Credentials', () => {
      Object.keys(suite.credentials).forEach(name => {
        it(`Should be able to retrieve auth for for ${ name } credentials.`, () => {
          return suite.EXP.start(suite.credentials[name]).getAuth();
        });
      });
    });
  });
};



