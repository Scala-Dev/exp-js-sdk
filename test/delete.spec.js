'use strict';

module.exports = suite => {
  describe('exp.delete(path, params)', () => {
    it('Should resolve when experience is deleted.', () => {
      suite.exp.start(suite.credentials.device);
      return suite.exp.post('/api/experiences').then(document => {
        return suite.exp.delete('/api/experiences/' + document.uuid);
      });
    });
  });
};