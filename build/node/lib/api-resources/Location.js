'use strict';

module.exports = function (context) {

  this.uuid = context.location.uuid;
  this.document = context.location;
};