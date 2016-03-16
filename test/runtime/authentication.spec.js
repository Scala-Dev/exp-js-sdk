'use strict';

module.exports = sdk => {
  describe('Authentication', () => {
    it('should authenticate sucessfully', () => sdk.getAuth());
  });
};