'use strict';

module.exports = function (context) {

  const api = require('../api');
  const iface = require('../interface');

  const Device = require('./Device');
  const Zone = require('./Zone');

  // Record the location's UUID
  this.uuid = context.location.uuid;

  // Get devices at this location.
  this.getDevices = () => {
    return api.get('/api/devices', { locationUuid: this.uuid })
      .then(query => {
        const devices = [];
        query.results.forEach(device => {
          devices.push(new Device({ device: device }));
        });
        return devices;
      });    
  };

  // Get zones at this location
  this.getZones = () => {
    return api.get('/api/zones', { locationUuid: this.uuid })
      .then(query => {
        const zones = [];
        query.results.forEach(zone => {
          zones.push(new Zone({ zone: zone }));
        });
        return zones;
      });    
  };

  // Broadcast a message about this location.
  this.broadcast = options => {
    return iface.broadcast({
      name: options.name,
      topic: options.topic,
      scope: this.uuid
    });
  };

  // Listen for a message about this location.
  this.listen = (options, callback) => {
    return iface.listen({
      name: options.name,
      topic: options.topic,
      scope: this.uuid
    }, callback);
  };

};

