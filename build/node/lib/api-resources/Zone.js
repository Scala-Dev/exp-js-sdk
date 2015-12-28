'use strict';

module.exports = function (context) {

  this.uuid = context.zone.uuid;
  this.document = context.zone;
};