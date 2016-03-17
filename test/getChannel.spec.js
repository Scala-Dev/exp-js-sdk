'use strict';

module.exports = suite => {
  describe('exp.getChannel(name, options)', () => {
    it('Should succeed when options ommitted.', () => {
      suite.exp.getChannel('name');
    });

    it('Should succeed when options empty.', () => {
      suite.exp.getChannel('name', {});
    });

    it('Should succeed when name is not specified', () => {
      suite.exp.getChannel();
    });

    it('Should default to { system: false }.', done => {
      const channel1 = suite.exp.getChannel('test');
      const channel2 = suite.exp.getChannel('test', { system: false });
      channel2.listen('test', () => done()).then(() => channel1.broadcast('test'));
      suite.exp.start(suite.credentials.device);
    });

  });
};



