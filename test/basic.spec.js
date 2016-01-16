'use strict';

const exp = require('../');

describe('basic', () => {

  it('should respond with a device', () => {
    return exp.findDevices().then(query => {
      if (!query.results) throw Error();
    });
  });

  it('should be able to send/receive a message on a custom channel', () => {
    return new Promise(resolve => {
      const channel = exp.getChannel('test');
      channel.listen('test', resolve);
      channel.broadcast('test');
    });
  });

  it('should be able to send/receive a message on a built in channel', () => {
    return new Promise(resolve => {
      const channel = exp.getChannel('organization');
      channel.listen('test', resolve);
      channel.broadcast('test');
    });
  });

  it('should receive experience update event', () => {
    return exp.createExperience({}).then(experience => {
      let resolve; let reject;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      experience.listen('update', () => resolve(), true);
      experience.document.name = 'Test' + Math.random();
      experience.save().catch(reject);
      return promise;
    });
  });

  it('should receive device update event', () => {
    return exp.createDevice({}).then(device => {
      let resolve; let reject;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      device.listen('update', resolve, true);
      device.document.name = 'Test' + Math.random();
      device.save().catch(reject);
      return promise;
    });
  });

  it('should be able to send and receive requests', () => {
    const channel = exp.getChannel('test');
    return new Promise((resolve, reject) => {
      channel.listen('echo', (payload, message) => {
        channel.respond('hi', () => { return { b: 1 }});
        channel.request(message.source, 'hi', { a: 1 }).then(response => {
          if (response.b === 1) return resolve();
          reject();
        });
      });
      channel.broadcast('echo');
    });
  });

  it('should get an error for failed requests', () => {
    const channel = exp.getChannel('test');
    return new Promise((resolve, reject) => {
      channel.listen('echo', (payload, message) => {
        channel.respond('hi', () => { throw new Error(); });
        channel.request(message.source, 'hi', { a: 1 }).then(reject).catch(resolve);
      });
      channel.broadcast('echo');
    });
  });

  it('should fling', () => {
    return exp.getChannel('experience').broadcast('fling', { uuid: 'b472652b-6692-4567-a211-53586cb5179c' });
  });



});
