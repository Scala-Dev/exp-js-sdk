'use strict';

const Collection = require('../utils/Collection');
const Resource = require('../utils/Resource');

class Experiences extends Collection {

  constructor (api, context) {
    super(api, context);
    this.path = '/api/experiences';
    this.Resource = Resource;
  }

}

module.exports = Experiences;
