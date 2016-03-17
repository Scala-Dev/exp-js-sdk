'use strict';

module.exports = suite => {
  describe('exp.patch(path, body, params)', () => {
    it('Should resolve to expected JSON document for experience when PATCH sent to experience.', done => {
      const name = Math.random().toString();
      suite.exp.post('/api/experiences').then(document => {
        return suite.exp.patch('/api/experiences/' + document.uuid, { name: name }).then(document => {
          if (document.name !== name) done(new Error()); else done();
        });
      });
      suite.exp.start(suite.credentials.device);
    });
  });

};