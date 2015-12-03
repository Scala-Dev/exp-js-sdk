'use strict';

const SdkError = require('../lib/SdkError');

class Collection {

  constructor (context) {
    this.api = require('../components/api');
    this.context = context;
  }

  get (uuid) {
    if (!uuid) return Promise.reject(new SdkError('uuidRequired'));
    return this.api.get(this.path + '/' + uuid).then(document => {
      return new this.Resource(document, this);
    });
  }

  create (document) {
    return new this.Resource(document, this);
  }

  save (resource) {
    return this.api.post(this.path + '/' + resource.uuid, null, resource.document);
  }

  find (params) {
    return this.api.get(this.path, params).then(query => {
      const results = query.results.map(document => new this.Resource(document, this));
      return { total: query.total, results: results };
    });
  }

}

module.exports = Collection;
