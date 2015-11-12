'use strict';

module.exports = function (context) {

  var api = require('../api');

  this.uuid = context.device.uuid;
  this.raw = context.device;
  this.document = context.device;

  this.getExperience = function () {
    if (context.current) {
      return api.getCurrentExperience();
    } else {
      return api.getExperience(context.device.experienceUuid);
    }
  };

  this.identify = function () {
    return api.identifyDevice(context.device.uuid);
  };
};