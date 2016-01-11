'use strict';

module.exports = function (context) {
  var _this = this;

  var config = require('../config');

  this.uuid = context.location.uuid;
  this.document = context.location;

  this.getLayoutUrl = function () {
    return config.host + '/api/locations/' + _this.uuid + '/layout';
  };
};