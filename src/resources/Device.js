'use strict';

const Resource = require('../lib/Resource');
const api = require('../components/api');

class Device extends Resource {

  getExperience () {
    return Promise.resolve()
      .then(() => api.getExperience(this.document.experience.uuid));
  }

}

module.exports = Device;
