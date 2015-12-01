const assert = require('assert');
const exp = require('../');

describe('pairing', () => {

  before(() => {
    return exp.runtime.start({
      username: 'e2mail@email.com',
      password: 'Password12321',
      organization: 'scala',
      host: 'http://localhost:9000'
    });
  });

  it('should respond with a device', () => {
    return exp.api.getDevices().then(results => {
      console.log(results);
    });
  });

});


describe('user authentication', () => {

  

});
