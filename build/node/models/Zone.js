'use strict';

module.exports = function (context) {

  var api = require('../api');

  this.uuid = context.zone.uuid;
  this.document = context.zone;

  this.getDevices = function () {
    return api.getDevices({ zoneUuid: context.zone.uuid });
  };

  this.getLocation = function () {
    return api.getLocation(context.zone.locationUuid);
  };
};