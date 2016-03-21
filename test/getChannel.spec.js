'use strict';

module.exports = suite => {
  describe('exp.getChannel(name, options)', () => {
    it('Should succeed when options ommitted.', () => {
      suite.startAsDevice().getChannel('name');
    });

    it('Should succeed when options empty.', () => {
      suite.startAsDevice().getChannel('name', {});
    });

    it('Should succeed when name is not specified', () => {
      suite.startAsDevice().getChannel();
    });

    it('Should default to { system: false }.', done => {
      const exp = suite.startAsDevice();
      const channel1 = exp.getChannel('test');
      const channel2 = exp.getChannel('test', { system: false });
      return channel2.listen('test', () => done()).then(() => channel1.broadcast('test'));
    });

  });
};



