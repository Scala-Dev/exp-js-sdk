'use strict';

module.exports = suite => {

  describe('exp.on(\'update\', callback)', () => {
    it('Should trigger on startup.', done => {
      suite.startAsDevice().on('update', () => done());
    });
    it('Should not trigger when credentials are bad.', done => {
      suite.credentials.device.uuid = '_';
      suite.startAsDevice().on('update', () => done(new Error()));
      setTimeout(done, 1000);
    });
  });

  describe('exp.on(\'online\', callback)', () => {
    it('Should trigger on startup.', done => {
      suite.startAsDevice().on('online', () => done());
    });
    it('Should not trigger when credentials are bad.', done => {
      suite.credentials.device.uuid = '_';
      suite.startAsDevice().on('update', () => done(new Error()));
      setTimeout(done, 1000);
    });
    it('Should not trigger when network is disabled.', done => {
      suite.credentials.device.enableNetwork = false;
      suite.startAsDevice().on('online', () => done(new Error()));
      setTimeout(done, 1000);
    });
  });


  describe('exp.on(\'offline\', callback)', () => {
    it('Should trigger on stop.', done => {
      const exp = suite.startAsDevice();
      exp.on('online', () => exp.stop());
      exp.on('offline', () => done());
    });
  });


  describe('exp.on(\'error\', callback)', () => {
    it('Should trigger for invalid credentials.', done => {
      suite.credentials.device.uuid = 'NOT THE RIGHT UUID';
      suite.startAsDevice().on('error', () => done());
    });
  });


};