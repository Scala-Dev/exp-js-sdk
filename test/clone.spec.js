'use strict';


module.exports = suite => {
  describe('exp.clone(context)', () => {
    it('Should succeed with no context when not started.', () => { suite.exp.clone(); });
    it('Should succeed with no context when started.', () => {
      suite.exp.start(suite.credentials.device);
      suite.exp.clone('context');
    });
    it('Should return an object with a clone() method when not started.', () => {
      if (!suite.exp.clone().clone) throw new Error();
    });
    it('Should return an object with a clone() method when started.', () => {
      suite.exp.start(suite.credentials.device);
      if (!suite.exp.clone().clone) throw new Error();
    });
    it('Should return an object that fires update event when original is started.', done => {
      let N = 0;
      const sdk1 = suite.exp.clone();
      const sdk2 = sdk1.clone('context!');
      sdk1.on('update', () => { N += 1; if (N === 2) done(); });
      sdk2.on('update', () => { N += 1; if (N === 2) done(); });
      suite.exp.start(suite.credentials.device);
    });
    it('Should not fire update event when context of clone is cleared.', done => {
      const sdk1 = suite.exp.clone();
      const sdk2 = suite.exp.clone('context!');
      sdk1.on('update', () => setTimeout(done, 100));
      sdk2.on('update', () => { done(new Error()); });
      sdk1.clear('context!');
      suite.exp.start(suite.credentials.device);
    });
  });
};