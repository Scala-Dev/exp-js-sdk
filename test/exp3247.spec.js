'use strict';

module.exports = suite => {
  describe('EXP-3279', () => {
    it('API calls to logs endpoint with empty JSON response should resolve to null.', () => {
      return suite.startAsDevice().post('/api/logs', []).then(response => {
        if (response !== null) throw new Error();
      });
    });
  });
};
