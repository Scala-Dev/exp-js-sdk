'use strict';

module.exports = suite => {
  describe('exp.get(path, params)', () => {
    it('Should resolve to JSON document for devices collection', done => {
      suite.exp.get('/api/devices').then(document => {
        if (!document.results) done(new Error()); else done();
      });
      suite.exp.start(suite.credentials.device);

    });
  });

};