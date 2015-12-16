'use strict';

const Collection = require('../utils/Collection');
const Resource = require('../utils/Resource');

class Locations extends Collection {

  constructor (api, context) {
    super(api, context);
    this.path = '/api/locations';
    this.Resource = Resource;
  }

}

module.exports = Locations;
