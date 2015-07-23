'use strict';

const Experience = require('./Experience');
const Device = require('./Device');
const Zone = require('./Zone');
const api = require('../api');
const utilities = require('../utilities');

/**
 * Location Object
 * @namespace Location
 * @property {string} uuid The locations's UUID.
 */

module.exports = function (context) {

  this.uuid = context.location.uuid;

  /**
   * Get the Location's Experience
   * @method getExperience
   * @memberOf Location
   * @returns {Promise} An [Experience Object]{@link Experience}
   */
  this.getExperience = () => {
    return api.get('/api/experiences/' + context.location.experienceUuid)
      .then(experience => new Experience({ experience: experience }));
  };

  /**
   * Get the Location's Devices
   * @method getDevice
   * @memberOf Location
   * @returns {Promise} A list of [Device Objects]{@link Device}
   */
  this.getDevices = () => {
    return api.get('/api/devices', { locationUuid: context.location.uuid })
      .then(query => {
        const devices = [];
        query.results.forEach(device => {
          devices.push(new Device({ device: device }));
        });
        return devices;
      });    
  };

  /**
   * Get the Location's Zones
   * @method getZones
   * @memberOf Location
   * @returns {Promise} A list of [Zone Objects]{@link Zone}
   */
  this.getZones = () => {
    return api.get('/api/zones', { locationUuid: context.location.uuid })
      .then(query => {
        const zones = [];
        query.results.forEach(zone => {
          zones.push(new Device({ zone: zone, location: context.location }));
        });
        return zones;
      });    
  };

  /**
   * Join this Location
   * @method join
   * @memberOf Location
   * @returns {Promise} Resolves when location is joined.
   */
  this.join = () => {
    // STUB
    // Send device enter message through interface.

    return Promise.resolve();
  };

  // Events
  // deviceEnter
  // deviceExit
  // [other]
  this.events = {
    // Trigger send message to locations
    // On 
  };

};

