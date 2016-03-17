'use strict';

module.exports = suite => {
  describe('exp.put(path, body, params)', () => {
    it('Should resolve to expected JSON document for data when put sent to data.', done => {
      suite.exp.put('/api/data/default/test', { test: 'test' }).then(document => {
        if (document.value.test !== 'test') done(new Error()); else done();
      });
      suite.exp.start(suite.credentials.device);
    });
  });

};