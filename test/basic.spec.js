'use strict';

const exp = require('../');

describe('basic', () => {

  it('should respond with a device', () => {
    return exp.api.findDevices().then(query => {
      if (!query.results) throw Error();
    });
  });

  it('should be able to send/receive a message on a custom channel', () => {
    return new Promise(resolve => {
      const channel = exp.network.getChannel('test');
      channel.on('test', resolve);
      channel.trigger('test');
    });
  });

  it('should be able to send/receive a message on a built in channel', () => {
    return new Promise(resolve => {
      const channel = exp.network.getChannel('organization');
      channel.on('test', resolve);
      channel.trigger('test');
    });
  });

  it('should receive experience update event', () => {
    return exp.api.createExperience({}).then(experience => {
      let resolve; let reject;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      experience.on('update', { system: true }, resolve);
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
    return exp.network.getChannel('experience').trigger('fling', { uuid: 'b472652b-6692-4567-a211-53586cb5179c' });
  });



});
