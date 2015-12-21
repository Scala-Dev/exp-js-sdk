'use strict';

const Resource = require('./Resource');

class Location extends Resource {

  static get path () {
    return '/1/locations';
  }

}

module.exports = Location;
