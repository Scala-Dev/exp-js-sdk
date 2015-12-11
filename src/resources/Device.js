'use strict';

const Resource = require('../lib/Resource');

class Device extends Resource {

  getExperience () {
    return Promise.resolve()
      .then(() => this._collection.api.getExperience(this.document.experience.uuid));
  }

  getLocation () {
    return Promise.resolve()
      .then(() => this._collection.api.getLocation(this.document.location.uuid));
  }

}

module.exports = Device;
