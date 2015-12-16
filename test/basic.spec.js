'use strict';

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
        host: 'https://api-develop.exp.scala.com'
      }).catch(error => {
        reject(error);
      });
    });

  });

  it('should respond with a device', () => {
    return exp.api.findDevices().then(query => {
      if (!query.results) throw Error();
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

  it('should receive experience update event', () => {
    return exp.api.createExperience({}).then(experience => {
      let resolve; let reject;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      experience.on('update', resolve);
      experience.document.name = 'Test' + Math.random();
      experience.save().catch(reject);
      return promise;
    });
  });

  it('should receive device update event', () => {
    return exp.api.createDevice({}).then(device => {
      let resolve; let reject;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      device.on('update', resolve);
      device.document.name = 'Test' + Math.random();
      device.save().catch(reject);
      return promise;
    });
  });

  it('should fling', () => {
    return exp.network.getChannel('experience').broadcast('fling', { uuid: 'b472652b-6692-4567-a211-53586cb5179c' });
  });



});


describe('user authentication', () => {

  

});
