'use strict';

const Collection = require('../lib/Collection');
const Resource = require('../lib/Resource');

class Locations extends Collection {

  constructor (api, context) {
    super(api, context);
    this.path = '/api/locations';
    this.Resource = Resource;
  }

}

module.exports = Locations;
