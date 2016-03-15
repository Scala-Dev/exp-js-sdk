'use strict';

// In loving memory of Rich K, who discovered this bug and left Scala only to
// have his organs slowly harvested while doing the devil's bidding.


module.exports = exp => {
  const sdk = exp.fork();
  describe('EXP-1511', () => {
    before(() => require('../seed/device')(sdk));
    before(() => require('../startup/device')(sdk));
    it('Should be able to listen on a channel immediately after connecting.', () => {
      const channel = sdk.getChannel('foo');
      return channel.listen('bar', () => {});
    });
    after(() => sdk.stop());
  });
};