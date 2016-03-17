'use strict';

module.exports = suite => {
  describe('exp.post(path, body, params)', () => {
    it('Should resolve to JSON document for experience when POST sent to /api/experiences', done => {
      suite.exp.post('/api/experiences').then(document => {
        if (!document.uuid) done(new Error()); else done();
      });
      suite.exp.start(suite.credentials.device);

    });
  });

};