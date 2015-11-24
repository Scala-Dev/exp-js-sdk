'use strict';

const Resource = require('./resource');

module.exports = class Device extends Resource {

  refresh () {
    const api = require('../api');
    return api.getDevice(this.document.uuid).then(device => {
      this.document = device.document;
      return this;
    });
  }

  get experience () {
    return this.document.experience;
  }

  identify () {
    const api = require('../api');
    return api.identifyDevice(this.uuid);
  }

};
