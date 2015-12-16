'use strict';

const Collection = require('../utils/Collection');
const Resource = require('../utils/Resource');

class Things extends Collection {

  constructor (api, context) {
    super(api, context);
    this.path = '/api/things';
    this.Resource = Resource;
  }

}

module.exports = Things;
