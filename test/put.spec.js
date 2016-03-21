'use strict';

module.exports = suite => {
  describe('exp.put(path, body, params)', () => {
    it('Should resolve to expected JSON document for data when put sent to data.', () => {
    	return suite.startAsDevice().put('/api/data/default/test', { test: 'test' }).then(document => {
        if (document.value.test !== 'test') throw new Error();
      });
    });
  });
};