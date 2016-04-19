'use strict';

module.exports = suite => {
  describe('exp.get(path, params)', () => {
    it('Should resolve to JSON document for devices collection', () => {
    	return suite.startAsDevice().get('/api/devices').then(document => {
        if (!document.results) throw new Error();
      });
    });
  });

};