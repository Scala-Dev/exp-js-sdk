'use strict';

const Collection = require('../utils/Collection');
const Resource = require('../utils/Resource');

class Data extends Collection {

  constructor (api, context) {
    super(api, context);
    this.path = '/api/data';
    this.Resource = Resource;
  }

}

module.exports = Data;
