const assert = require('assert');
const exp = require('../');

describe('pairing', () => {

  before(() => {
    return new Promise((resolve, reject) => {
      exp.network.on('online', () => {
        resolve();
      });
      return exp.runtime.start({
        username: 'email@email.com',
        password: 'Password12321',
        organization: 'scala',
        host: 'http://localhost:9000'
      }).catch(error => {
        reject(error);
      });
    });

  });

  it('should respond with a device', () => {
    return exp.api.findDevices().then(results => {
      console.log(results);
    });
  });

  it('should be able to send/receive a message on a custom channel', () => {
    return new Promise(resolve => {
      const channel = exp.network.getChannel('test');
      channel.listen('test', resolve);
      channel.broadcast('test');
    });
  });

  it('should be able to send/receive a message on a built in channel', () => {
    return new Promise(resolve => {
      const channel = exp.network.getChannel('organization');
      channel.listen('test', resolve);
      channel.broadcast('test');
    });
  });



});


describe('user authentication', () => {

  

});
