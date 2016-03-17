'use strict';

module.exports = suite => {

  describe('exp.on(\'update\', callback)', () => {
    Object.keys(suite.credentials).forEach(name => {
      it(`Should trigger on startup for ${ name } credentials.`, done => {
        suite.exp.on('update', () => done());
        suite.exp.start(suite.credentials[name]);
      });
      it(`Should trigger with payload for ${ name } credentials.`, done => {
        suite.exp.on('update', auth => {
          if (!auth) done(new Error()); else done();
        });
        suite.exp.start(suite.credentials[name]);
      });
    });
    it('Should not trigger when credentials are bad.', done => {
      setTimeout(done, 1000);
      suite.exp.on('update', () => done(new Error()));
      try { suite.exp.start({}); }
      catch (exception) {}
    });
  });

  describe('exp.on(\'online\', callback)', () => {
    Object.keys(suite.credentials).forEach(name => {
      it(`Should trigger on startup for ${ name } credentials.`, done => {
        suite.exp.on('online', () => done());
        suite.exp.start(suite.credentials[name]);
      });
    });
    it('Should not trigger when credentials are bad.', done => {
      setTimeout(done, 1000);
      suite.exp.on('online', () => done(new Error()));
      try { suite.exp.start({}); }
      catch (exception) {}
    });
    it('Should not trigger when network is disabled.', done => {
      setTimeout(done, 1000);
      suite.exp.on('online', () => done(new Error()));
      suite.credentials.device.enableNetwork = false;
      try { suite.exp.start(suite.credentials.device); }
      catch (exception) {}
    });
  });


  describe('exp.on(\'offline\', callback)', () => {
    Object.keys(suite.credentials).forEach(name => {
      it(`Should trigger on stop for ${ name } credentials.`, done => {
        suite.exp.on('offline', () => done());
        suite.exp.on('online', () => suite.exp.stop());
        suite.exp.start(suite.credentials[name]);
      });
    });
  });


  describe('exp.on(\'error\', callback)', () => {
    it('Should trigger for invalid credentials.', done => {
      suite.exp.on('error', () => done());
      suite.credentials.user.password = 'NOT THE RIGHT PASSWORD';
      suite.exp.start(suite.credentials.user);
    });
    it('Should trigger for invalid credentials with an error.', done => {
      suite.exp.on('error', error => { if (error instanceof Error) done(); });
      suite.credentials.user.password = 'NOT THE RIGHT PASSWORD';
      suite.exp.start(suite.credentials.user);
    });
  });


};