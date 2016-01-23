'use strict';

const exp = require('../');


describe('basic', () => {

  it('should respond with a device', () => {
    return exp.findDevices().then(query => {
      if (!query.results) throw Error();
    });
  });

  it('should be able to get a channel', () => {
    if (!exp.getChannel(Math.random().toString())) throw new Error('');
  });

  it('should be able to send a message with a payload', () => {
    return exp.getChannel('testChannel').broadcast('test', {});
  });

  it('should be able to send a message with a timeout', () => {
    return exp.getChannel(Math.random().toString()).broadcast('test', null, 500);
  });

  it('should be able to listen on a channel.', () => {
    return exp.getChannel(Math.random().toString()).listen('test', () => {});
  });

  it('should call listener callback on broadcast', () => {
    return new Promise(resolve => {
      exp.getChannel(Math.random().toString()).listen('test', resolve).then(channel => channel.broadcast('test'));
    });
  });

  it('should receive broadcast payload in listener callback', () => {
    return new Promise(resolve => {
      return exp.getChannel(Math.random().toString()).listen('test', payload => {
        if (payload === 55) resolve();
      }).then(channel => channel.broadcast('test', 55));
    });
  });

  it('should receive response to broadcast event', () => {
    return exp.getChannel(Math.random().toString()).listen('test', (payload, callback) => {
      callback({ value: 199});
    }).then(channel => {
      return channel.broadcast('test', null, 500).then(response => {
        if (response.length !== 1 || response[0].value !== 199) throw new Error();
      });
    });
  });

  it('should receive multiple responses to broadcast event', () => {
    return exp.getChannel(Math.random().toString())
      .listen('test', (payload, callback) => callback(1))
      .then(channel => {
        channel.listen('test', (payload, callback) => callback(2));
        channel.listen('test', (payload, callback) => callback(3));
        return channel.broadcast('test', null, 500).then(response => {
          if (response.length !== 3) throw new Error();
          else if (response.indexOf(1) === -1) throw new Error();
          else if (response.indexOf(2) === -1) throw new Error();
          else if (response.indexOf(3) === -1) throw new Error();
        });
      });
  });

  it('should receive experience update event', () => {
    return exp.createExperience({}).then(experience => {
      let resolve; let reject;
      const promise = new Promise((a, b) => { resolve = a; reject = b; });
      experience.getChannel({ system: true }).listen('update', () => resolve(), true);
      experience.document.name = 'Test' + Math.random();
      experience.save().catch(reject);
      return promise;
    });
  });

  it('something', () => {
    return new Promise(resolve => {});
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
