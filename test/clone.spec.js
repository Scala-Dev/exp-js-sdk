'use strict';


module.exports = suite => {
  describe('exp.clone(context)', () => {
    it('Should succeed with no context.', () => {
      suite.startAsDevice().clone();
    });
    it('Should return an object with a clone() method.', () => {
      if (!suite.startAsDevice().clone().clone) throw new Error();
    });
    it('Should return an object that fires update event.', done => {
      let N = 0;
      const exp = suite.startAsDevice();
      const exp2 = exp.clone('context!');
      exp.on('update', () => { N += 1; if (N === 2) done(); });
      exp2.on('update', () => { N += 1; if (N === 2) done(); });
    });
    it('Should not fire update event when context of clone is cleared.', done => {
      const exp = suite.startAsDevice();
      const exp2 = exp.clone('context!');
      exp.on('update', () => setTimeout(done, 100));
      exp2.on('update', () => { done(new Error()); });
      exp2.clear('context!');
    });
  });
};