'use strict';

const Collection = require('../lib/Collection');
const Resource = require('../lib/Resource');

class Things extends Collection {

  constructor (api, context) {
    super(api, context);
    this.path = '/api/things';
    this.Resource = Resource;
  }

}

module.exports = Things;
