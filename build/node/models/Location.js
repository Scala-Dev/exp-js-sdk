'use strict';

module.exports = function (context) {

  var api = require('../api');

  this.uuid = context.location.uuid;

  this.getZones = function () {
    return api.getZones({ locationUuid: context.location.uuid });
  };
};