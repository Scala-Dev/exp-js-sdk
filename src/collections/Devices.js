'use strict';

const Collection = require('../lib/Collection');
const Resource = require('../resources/Device');

class Devices extends Collection {

  constructor (context) {
    super(context);
    this.path = '/api/devices';
    this.Resource = Resource;
  }

}

module.exports = Devices;
