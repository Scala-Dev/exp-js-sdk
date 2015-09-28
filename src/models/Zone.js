'use strict';

module.exports = function (context) {

  const api = require('../api');

  this.uuid = context.zone.uuid;
  this.document = context.zone;

  this.getDevices = () => {
    return api.getDevices({ zoneUuid: context.zone.uuid });
  };

  this.getLocation = () => {
    return api.getLocation(context.zone.locationUuid);
  };

};

