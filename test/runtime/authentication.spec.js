'use strict';

module.exports = exp => {
  describe('Authentication', () => {
    it('should authenticate sucessfully', () => exp.getAuth());
  });
};