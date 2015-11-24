'use strict';

const Resource = require('./resource');

module.exports = class Experience extends Resource {

  refresh () {
    const api = require('../api');
    return api.getExperience(this.document.uuid).then(experience => {
      this.document = experience.document;
      return this;
    });
  }

};
