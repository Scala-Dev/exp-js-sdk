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
    it('Should be able to refresh auth.', () => {
      const exp = suite.startAsDevice();
      return exp.getAuth().then(() => {
        exp._sdk.authenticator._refresh();
        return exp.getAuth();
      });
    });
  });
};