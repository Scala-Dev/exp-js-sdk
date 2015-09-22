'use strict';

module.exports = function (context) {

  const api = require('../api');

  this.uuid = context.location.uuid;
  this.document = context.location;

  this.getZones = () => {
    return api.getZones({ locationUuid: context.location.uuid });
  };

};

