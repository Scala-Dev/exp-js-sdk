'use strict';

module.exports = suite => {
  describe('exp.stop()', () => {
    it('After stop should get sync error when calling getAuth().', done => {
      const exp = suite.startAsDevice();
      exp.stop();
      try { exp.getAuth() }
      catch (expcetion) { done(); }
      
    });
    it('After stop should get sync error when calling findDevices().', done => {
      const exp = suite.startAsDevice();
      exp.stop();
      try { exp.findDevices() }
      catch (expcetion) { done(); }
    });
    it('After stop should get error in cloned SDK when calling getAuth().', done => {
      const exp = suite.startAsDevice();
      exp.stop();
      try { exp.clone().getAuth() }
      catch (expcetion) { done(); }
    });
  });
};



