'use strict';

const Collection = require('../lib/Collection');
const Device = require('../resources/Device');

class Devices extends Collection {

  constructor (context) {
    super(context);
    this.path = '/api/devices';
    this.Resource = Device;
  }

}

module.exports = Devices;
