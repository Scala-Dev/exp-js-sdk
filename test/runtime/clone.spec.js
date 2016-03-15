'use strict';

module.exports = exp => {
  describe('Cloning', () => {
    describe('Sanity', () => {
      it('Should succeed', () => exp.clone());
      it('Should succeed with a context.', () => exp.clone('context'));
    });
  });
};