'use strict';

const Resource = require('./Resource');
const api = require('../api');

class Feed extends Resource {

  static get path () {
    return '/api/connectors/feeds';
  }

  getData () {
    return this.api.get(this.path + '/' + this.document.uuid + '/data');
  }

}

module.exports = Feed;
