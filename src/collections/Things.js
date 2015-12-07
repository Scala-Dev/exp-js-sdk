'use strict';

const Collection = require('../lib/Collection');
const Resource = require('../lib/Resource');

class Things extends Collection {

  constructor (context) {
    super(context);
    this.path = '/api/devices';
    this.Resource = Resource;
  }

}

module.exports = Things;
