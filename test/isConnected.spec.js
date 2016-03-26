'use strict';

module.exports = suite => {
  describe('exp.isConnected', () => {
    it('Should be true when online.', done => {
      const exp = suite.startAsDevice();
      exp.on('online', () => { if (exp.isConnected) done(); });
    });
    it('Should be false immediately after start.', () => {
      if (suite.startAsDevice().isConnected) throw new Error();
    });
  });
};



