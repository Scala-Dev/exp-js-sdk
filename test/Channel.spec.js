

module.exports = suite => {
  describe('Channel', () => {
    describe('After Startup', () => {
      beforeEach(done => {
        suite.exp.start(suite.credentials.device);
        suite.exp.on('online', done);
      });

      it('should be able to send a message with a payload', () => {
        const channel = suite.exp.getChannel('test');
        return channel.broadcast('test', {});
      });

      it('should be able to send a message with a timeout', () => {
        const channel = suite.exp.getChannel('test');
        return channel.broadcast('test', null, 500);
      });

      it('should be able to listen on a channel.', () => {
        const channel = suite.exp.getChannel('test');
        return channel.listen('test', () => {});
      });

      it('should call listener callback on broadcast', done => {
        const channel = suite.exp.getChannel('test');
        channel.listen('test', () => done()).then(() => channel.broadcast('test'));
      });

      it('should be able to fling on a channel', () => {
        suite.exp.getChannel('name').fling({});
      });

      it('should receive broadcast payload in listener callback', done => {
        const channel = suite.exp.getChannel('test');
        channel.listen('test', payload => {
          if (payload !== 55) done(new Error()); else done();
        }).then(() => channel.broadcast('test', 55));
      });

      it('should receive response to broadcast event', done => {
        const channel = suite.exp.getChannel('test');
        channel.listen('test', (payload, callback) => callback({ value: 199})).then(() => {
          channel.broadcast('test', null, 500).then(response => {
            if (response.length !== 1 || response[0].value !== 199) done(new Error()); else done();
          });
        });
      });

      it('should receive multiple responses to broadcast event', done => {
        const channel = suite.exp.getChannel('test');
        Promise.resolve()
        .then(() => channel.listen('test', (payload, callback) => callback(1)))
        .then(() => channel.listen('test', (payload, callback) => callback(2)))
        .then(() => channel.listen('test', (payload, callback) => callback(3)))
        .then(() => {
          return channel.broadcast('test', null, 500).then(response => {
            if (response.length !== 3) return done(new Error());
            else if (response.indexOf(1) === -1) return done(new Error());
            else if (response.indexOf(2) === -1) return done(new Error());
            else if (response.indexOf(3) === -1) return done(new Error());
            done();
          });
        });
      });

      it('should be able to cancel listener', done => {
        const channel = suite.exp.getChannel('test');
        channel.listen('test', () => done(new Error())).then(listener => {
          listener.cancel();
          return channel.broadcast('test');
        });
        setTimeout(done, 1000);
      });
    });

    describe('Before Startup', () => {
      it('should be able to receive message on a channel when listen is called before startup.', done => {
        const channel = suite.exp.getChannel('test');
        channel.listen('test', () => done()).then(() => channel.broadcast('test'));
        suite.exp.start(suite.credentials.device);
      });
    });

  });
};