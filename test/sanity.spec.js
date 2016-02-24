'use strict';

const exp = require('../');


describe('Sanity Tests', () => {
  let name;
  let promise;
  let resolve;
  let reject;

  beforeEach(() => {
    name = Math.random().toString();
    promise = new Promise((a, b) => {
      resolve = a;
      reject = b;
    });
  });

  it('should respond with a device', () => {
    return exp.findDevices().then(query => {
      if (!query.results) throw Error();
    });
  });

  it('should be able to get a channel', () => {
    return exp.getChannel(name);
  });

  it('should be able to send a message with a payload', () => {
    const channel = exp.getChannel(name);
    return channel.broadcast('test', {});
  });

  it('should be able to send a message with a timeout', () => {
    const channel = exp.getChannel(name);
    return channel.broadcast('test', null, 500);
  });

  it('should be able to listen on a channel.', () => {
    const channel = exp.getChannel(name);
    return channel.listen('test', () => {});
  });

  it('should call listener callback on broadcast', () => {
    const channel = exp.getChannel(name);
    channel.listen('test', resolve).then(() => channel.broadcast('test'));
    return promise;
  });

  it('should receive broadcast payload in listener callback', () => {
    const channel = exp.getChannel(name);
    channel.listen('test', payload => {
      if (payload !== 55) reject();
      else resolve();
    }).then(() => channel.broadcast('test', 55));
    return promise;
  });

  it('should receive response to broadcast event', () => {
    const channel = exp.getChannel(name);
    channel.listen('test', (payload, callback) => callback({ value: 199})).then(() => {
      channel.broadcast('test', null, 500).then(response => {
        if (response.length !== 1 || response[0].value !== 199) reject();
        else resolve();
      });
    });
    return promise;
  });

  it('should receive multiple responses to broadcast event', () => {
    const channel = exp.getChannel(name);
    Promise.resolve()
    .then(() => channel.listen('test', (payload, callback) => callback(1)))
    .then(() => channel.listen('test', (payload, callback) => callback(2)))
    .then(() => channel.listen('test', (payload, callback) => callback(3)))
    .then(() => {
      return channel.broadcast('test', null, 500).then(response => {
        if (response.length !== 3) reject();
        else if (response.indexOf(1) === -1) reject();
        else if (response.indexOf(2) === -1) reject();
        else if (response.indexOf(3) === -1) reject();
        resolve();
      });
    });
    return promise;
  });

  it('should receive experience update event', () => {
    exp.createExperience({}).then(experience => {
      const channel = experience.getChannel({ system: true });
      channel.listen('update', resolve).then(() => {
        experience.document.name = 'Test' + Math.random();
        experience.save();
      });
    });
    return promise;
  });

  it('should be able to cancel listener', () => {
    const channel = exp.getChannel(name);
    channel.listen('test', () => reject()).then(listener => {
      listener.cancel();
      return channel.broadcast('test');
    });
    setTimeout(resolve, 1000);
    return promise;
  });

  it('should be able to listen for sdk events without an error (regression).', () => {
    return exp.on('update', () => {});
  });

/*
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

*/

});
