'use strict';

module.exports = suite => {
  describe('exp.post(path, body, params)', () => {
    it('Should resolve to JSON document for experience when POST sent to /api/experiences', () => {
      return suite.startAsDevice().post('/api/experiences').then(document => {
        if (!document.uuid) throw new Error();
      });
    });
  });
};