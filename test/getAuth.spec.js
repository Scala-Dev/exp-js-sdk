'use strict';


module.exports = suite => {
  describe('exp.getAuth()', () => {
    it('Should resolve with payload if called before startup.', () => {
      const promise = suite.exp.getAuth().then(payload => { if (!payload) throw new Error(); });
      suite.exp.start(suite.credentials.device);
      return promise;
    });
    it('Should resolve with payload if called after startup.', () => {
      suite.exp.start(suite.credentials.device);
      return suite.exp.getAuth().then(payload => { if (!payload) throw new Error(); });
    });
    it('Should not resolve if not started.', done => {
      setTimeout(done, 1000);
      suite.exp.getAuth().then(() => done(new Error()));
    });
  });
};