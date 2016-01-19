'use strict';

const Resource = require('./Resource');

class Feed extends Resource {

  static get path () {
    return '/api/connectors/feeds';
  }

  getData () {
    return this.sdk.api.get(this.path + '/' + this.document.uuid + '/data');
  }

}

module.exports = Feed;
