'use strict';


module.exports = suite => {
  describe('exp.getAuth()', () => {
    it('Should resolve with payload.', () => {
      return suite.startAsDevice().getAuth();
    });
    it('Should reject with error if auth is invalid.', done => {
      suite.credentials.device.uuid = 'WRONG UUID';
      suite.startAsDevice().getAuth().then(() => done(new Error()), () => done());
    });
  });
};