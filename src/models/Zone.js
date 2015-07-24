'use strict';

module.exports = function (context) {

  const api = require('../api');
  const iface = require('../interface');

  const Device = require('./Device');
  const Location = require('./Location');

  // Record the zone's UUID
  this.uuid = context.zone.uuid;

  // Get devices at this zone.
  this.getDevices = () => {
    return api.get('/api/devices', { zoneUuid: this.uuid })
      .then(query => {
        const devices = [];
        query.results.forEach(device => {
          devices.push(new Device({ device: device }));
        });
        return devices;
      });    
  };

  // Get this zone's location.
  this.getLocation = () => {
    return api.get('/api/locations/' + context.zone.locationUuid)
      .then(location => {
        return new Location({ location: location });
      });    
  };

  // Broadcast a message about this zone.
  this.broadcast = options => {
    return iface.broadcast({
      name: options.name,
      topic: options.topic,
      scope: this.uuid
    });
  };

  // Listen for a message about this zone.
  this.listen = (options, callback) => {
    return iface.listen({
      name: options.name,
      topic: options.topic,
      scope: this.uuid
    }, callback);
  };

};

