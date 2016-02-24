'use strict';

const Resource = require('./Resource');
const api = require('../api');

class Feed extends Resource {

  static get path () {
    return '/api/connectors/feeds';
  }

  getData () {
    return api.get(this.documentPath + '/data');
  }

}

module.exports = Feed;
