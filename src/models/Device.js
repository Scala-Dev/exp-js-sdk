'use strict';

module.exports = function (context) {

  const api = require('../api');
  const iface = require('../interface');

  const Experience = require('./Experience');
  const Location = require('./Location');
  const Zone = require('./Zone');

  // Record the device's UUID.
  this.uuid = context.device.uuid;

  // Get this devices experience.
  this.getExperience = () => {
    return api.get('/api/experiences/' + context.device.experienceUuid)
      .then(experience => {
        return new Experience({ experience: experience });
      });
  };

  // Get this device's zone.
  this.getZone = () => {
    return api.get('/api/zones/' + context.device.zoneUuid)
      .then(zone => {
        return new Zone({ zone: zone });
      });
  };

  // Get this device's location.
  this.getLocation = () => {
    return api.get('/api/locations/' + context.device.locationUuid)
      .then(location => {
        return new Location({ location: location });
      });
  };

  // Broadcast an event about this device.
  this.broadcast = options => {
    return iface.broadcast({
      name: options.name,
      topic: options.topic,
      scope: this.uuid
    });
  };

  // Listen for events about this device.
  this.listen = (options, callback) => {
    return iface.listen({
      name: options.name,
      topic: options.topic,
      scope: this.uuid
    }, callback);
  };

  if (context.current) {
    // Respond to a request to this device.
    this.respond = (options, callback) => {
      return iface.respond({
        name: options.name,
        topic: options.topic
      }, callback);
    };
  } else {
    // Send a request to this device.
    this.request = options => {
      return iface.request({
        name: options.name,
        topic: options.topic,
        target: {
          device: this.uuid
        }
      });
    };
  };


};


