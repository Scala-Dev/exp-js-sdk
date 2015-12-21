'use strict';

const Resource = require('./Resource');

class Experience extends Resource {

  static get path () {
    return '/1/experiences';
  }

}

module.exports = Experience;
