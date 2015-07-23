'use strict';

const iface = require('../interface');

module.exports = function (context) {

  const api = require('../api'); // Avoid circular import.

  this.uuid = context.device.uuid;

  // Get this devices experience.
  this.getExperience = () => {
    return Promise.resolve()
      .then(() => {
        if (!context.device.experienceUuid) throw new Error('experienceNotFound');
        return api.getExperience({ uuid: context.device.experienceUuid });
      });
  };

  // Broadcast an event about this device.
  this.broadcast = options => {
    return iface.broadcast({
      name: options.name,
      scope: context.device.uuid
    });
  };

  // Listen for events about this device.
  this.listen = (options, callback) => {
    return iface.listen({
      name: options.name,
      scope: context.device.uuid
    }, callback);
  };


  if (context.current) {
    // Respond to a request to this device.
    this.respond = (options, callback) => {
      return iface.respond({
        name: options.name,
        scope: options.scope
      }, callback);
    };
  } else {
    // Send a request to this device.
    this.request = options => {
      return iface.request({
        name: options.name,
        target: {
          device: context.device.uuid
        },
        scope: options.scope
      });
    };
  };


};


