'use strict';

const Resource = require('./Resource');
const runtime = require('../../runtime');

class Location extends Resource {

  static get path () {
    return '/api/locations';
  }

  static getLayoutUrl () {
    return runtime.auth.api.host  + '/api/locations/' + this.document.uuid + '/layout';
  };

}

module.exports = Location;
