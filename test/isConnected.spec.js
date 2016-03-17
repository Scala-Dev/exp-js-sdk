'use strict';

module.exports = suite => {
  describe('exp.isConnected', () => {
    it('Should be true when online.', done => {
      suite.exp.on('online', () => {
        if (!suite.exp.isConnected) done(new Error());
        done();
      });
      suite.exp.start(suite.credentials.device);
    });
    it('Should be false when not started.', () => {
      if (suite.exp.isConnected) throw new Error();
    });
  });
};



