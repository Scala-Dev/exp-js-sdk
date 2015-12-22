'use strict';

const Resource = require('./Resource');

class Experience extends Resource {

  static get path () {
    return '/api/experiences';
  }

}

module.exports = Experience;
