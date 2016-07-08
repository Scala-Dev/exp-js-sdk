'use strict';

module.exports = suite => {
  describe('EXP.start(options)', () => {
    describe('Using Valid Credentials', () => {
      Object.keys(suite.credentials).forEach(name => {
        it(`Should be able to retrieve auth for for ${ name } credentials.`, () => {
          return suite.EXP.start(suite.credentials[name]).getAuth();
        });
      });
    });


    describe.only('auth parameter', () => {

      let auth;
      beforeEach(() => {
        const exp = suite.EXP.start(suite.credentials['device']);
        return exp.getAuth().then(auth_ => auth = auth_);
      });

      describe('without credentials', () => {

        it('should succeed', () => {
          const exp = suite.EXP.start({ auth, host: 'http://localhost:9000' });
          return exp.getCurrentDevice();
        });

        describe('when expiration is in the past', () => {
          it('should fire off two auth updates #fragile?', done => {
            auth.expiration = auth.expiration - 86400 * 1000;
            const exp = suite.EXP.start({ auth, host: 'http://localhost:9000' });
            let count = 0;
            exp.on('update', () => {
              count++;
              if (count == 2) done();
            });
          });
        });

        describe('when auth is invalid', () => {
          beforeEach(() => auth.token = auth.token + 'cheese');
          it('requests should fail', () => {
            const exp = suite.EXP.start({ auth, host: 'http://localhost:9000' });
            return exp.getCurrentDevice().then(() => { throw new Error(); }, () => {});
          });
        });
      });

      describe('with credentials', () => {

        it('should succeed when creds are good and auth is good but expired', () => {
          const options = suite.credentials.device;
          options.auth = auth;
          options.auth.expiration = 0;
          const exp = suite.EXP.start(options);
          return exp.getCurrentDevice();
        });

        it('should succeed when creds are bad but auth is good', () => {
          const options = suite.credentials.device;
          options.auth = auth;
          options.uuid = 'cheese';
          const exp = suite.EXP.start(options);
          return exp.getCurrentDevice();
        });

        it('should succeed when creds are good and auth is bad', () => {
          const options = suite.credentials.device;
          options.auth = auth;
          options.auth.token = 'cheese';
          const exp = suite.EXP.start(options);
          return exp.getCurrentDevice();
        });

        it('should succeed when auth is expired and creds are bad', () => {
          const options = suite.credentials.device;
          options.auth = auth;
          options.auth.expiration = 0;
          options.uuid = 'cheese';
          const exp = suite.EXP.start(options);
          return exp.getCurrentDevice();
        });

        it('should fail when auth is bad and creds are bad', () => {
          const options = suite.credentials.device;
          options.auth = auth;
          options.auth.token = 'cheese';
          options.uuid = 'cheese';
          const exp = suite.EXP.start(options);
          return exp.getCurrentDevice().then(() => { throw new Error(); }, () => {});
        });

      });


    });
  });
};
