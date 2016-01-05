'use strict';

module.exports = function (context) {

  const config = require('../config');

  this.uuid = context.location.uuid;
  this.document = context.location;

  this.getLayoutUrl = () => {
    return config.host + '/api/locations/' + this.uuid + '/layout';
  };

};

