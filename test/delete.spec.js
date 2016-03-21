'use strict';

module.exports = suite => {
  describe('exp.delete(path, params)', () => {
    it('Should resolve when experience is deleted.', () => {
      const exp = suite.startAsDevice();
      return exp.post('/api/experiences').then(document => {
        return exp.delete('/api/experiences/' + document.uuid);
      });
    });
  });
};