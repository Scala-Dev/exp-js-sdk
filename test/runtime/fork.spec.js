'use strict';

module.exports = sdk => {
  describe('Forking', () => {
  	it('Should succeed.', () => sdk.fork());
  	it('Should succeed with a context.', () => sdk.fork('context'));
  });
};