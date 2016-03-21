'use strict';

module.exports = suite => {
  describe('exp.patch(path, body, params)', () => {
    it('Should resolve to expected JSON document for experience when PATCH sent to experience.', () => {
      const name = Math.random().toString();
      const exp = suite.startAsDevice();
      return exp.post('/api/experiences').then(document => {
        return exp.patch('/api/experiences/' + document.uuid, { name: name }).then(document => {
          if (document.name !== name) throw new Error();
        });
      });
    });
  });

};