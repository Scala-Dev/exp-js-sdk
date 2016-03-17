'use strict';

module.exports = suite => {
  describe('exp.stop()', () => {
    it('After stop should get sync error when trying to start.', done => {
      suite.exp.start(suite.credentials.device).then(() => suite.exp.stop()).then(() => {
        try { suite.exp.start(suite.credentials.device); }
        catch (expcetion) { done(); }
      });
    });
    it('After stop should get sync error when calling getAuth().', done => {
      suite.exp.start(suite.credentials.device).then(() => suite.exp.stop()).then(() => {
        try { suite.exp.getAuth() }
        catch (expcetion) { done(); }
      });
    });
    it('After stop should get sync error when calling findDevices().', done => {
      suite.exp.start(suite.credentials.device).then(() => suite.exp.stop()).then(() => {
        try { suite.exp.findDevices() }
        catch (expcetion) { done(); }
      });
    });
    it('After stop should get error in cloned SDK when calling getAuth().', done => {
      const sdk = suite.exp.clone();
      suite.exp.start(suite.credentials.device).then(() => suite.exp.stop()).then(() => {
        try { sdk.getAuth() }
        catch (expcetion) { done(); }
      });
    });
    it('After stop should get sync error in context cloned SDK when calling getAuth().', done => {
      const sdk = suite.exp.clone('context!');
      suite.exp.start(suite.credentials.device).then(() => suite.exp.stop()).then(() => {
        try { sdk.getAuth() }
        catch (expcetion) { done(); }
      });
    });
    it('After stop should not get error calling getAuth in forked SDK.', done => {
      const sdk = suite.exp.fork();
      return suite.exp.start(suite.credentials.device).then(() => suite.exp.stop()).then(() => {
        sdk.getAuth();
        done();
      });
    });
  });
};



