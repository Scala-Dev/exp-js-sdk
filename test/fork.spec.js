'use strict';


module.exports = suite => {
  describe('exp.fork(context)', () => {
    it('Should succeed with no context when not started.', () => { suite.exp.fork(); });
    it('Should succeed with no context when started.', () => {
      suite.exp.start(suite.credentials.device);
      suite.exp.fork('context');
    });
    it('Should return an object with a fork() method when not started.', () => {
      if (!suite.exp.fork().fork) throw new Error();
    });
    it('Should return an object with a fork() method when started.', () => {
      suite.exp.start(suite.credentials.device);
      if (!suite.exp.fork().fork) throw new Error();
    });
    it('Should not fire update event of parent.', done => {
      const sdk = suite.exp.fork();
      suite.exp.on('update', () => setTimeout(done, 100));
      sdk.on('update', () => { done(new Error()); });
      suite.exp.start(suite.credentials.device);
    });
  });
};