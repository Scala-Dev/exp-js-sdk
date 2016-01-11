'use strict';

const Resource = require('./Resource');
const Api = require('../Api');

class Feed extends Resource {

  static get path () {
    return '/api/connectors/feeds';
  }

  getData () {
    return Api.get(this.path + '/' + this.document.uuid + '/data');
  }

}

module.exports = Feed;
