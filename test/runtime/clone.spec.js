'use strict';

module.exports = sdk => {
  describe('Cloning', () => {
  	it('Should succeed', () => sdk.clone());
    it('Should succeed with a context.', () => sdk.clone('context'));
  });
};