'use strict';

const Resource = require('./Resource');

class Location extends Resource {

  static get path () {
    return '/api/locations';
  }

}

module.exports = Location;
