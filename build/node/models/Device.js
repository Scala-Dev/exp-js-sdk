'use strict';

module.exports = function (context) {

  var api = require('../api');

  this.uuid = context.device.uuid;
  this.raw = context.device;

  this.getExperience = function () {
    if (context.current) {
      return api.getCurrentExperience();
    } else {
      return api.getExperience(context.device.experienceUuid);
    }
  };

  this.getZone = function () {
    return api.getZone(context.device.zoneUuid);
  };
};