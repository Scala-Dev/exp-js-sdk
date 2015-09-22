'use strict';

module.exports = function (context) {

  const api = require('../api');

  this.uuid = context.device.uuid;
  this.raw = context.device;

  this.getExperience = () => {
    if (context.current) {
      return api.getCurrentExperience();
    } else {
      return api.getExperience(context.device.experienceUuid);
    }
  };

  this.getZone = () => {
    return api.getZone(context.device.zoneUuid);
  };

  this.identify = () => {
    return api.identifyDevice(context.device.uuid);
  };
};


