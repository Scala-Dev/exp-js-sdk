'use strict';

module.exports = function (context) {

  const api = require('../api');

  this.uuid = context.feed.uuid;
  this.raw = context.feed;
  this.document = context.feed;

  this.getData = () => {
    return api.get('/api/connectors/feeds/' + context.feed.uuid + '/data');
  };

};
