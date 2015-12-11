'use strict';

const Collection = require('../lib/Collection');
const Resource = require('../lib/Resource');

class Experiences extends Collection {

  constructor (api, context) {
    super(api, context);
    this.path = '/api/experiences';
    this.Resource = Resource;
  }

}

module.exports = Experiences;
