'use strict';

const SdkError = require('./SdkError');

class Collection {

  constructor (api, context) {
    this.api = api;
    this.network = require('../components/network').getDelegate(context);
    this.runtime = require('../components/runtime').getDelegate(context);
    this.context = context;
  }

  get (uuid) {
    if (!uuid) return Promise.reject(new SdkError('uuidRequired'));
    return this.api.get(this.path + '/' + uuid).then(document => {
      return new this.Resource(document, this);
    });
  }

  create (document, options) {
    options = options || {};
    const resource = new this.Resource(document, this);
    if (options.save === false && options._sync === true) return resource;
    if (options.save === false) return Promise.resolve(resource);
    return this.api.post(this.path, null, resource.document).then(document => {
      resource.document = document;
      return resource;
    });
  }

  save (resource) {
    return this.api.patch(this.path + '/' + resource.uuid, null, resource.document);
  }

  find (params) {
    return this.api.get(this.path, params).then(query => {
      const results = query.results.map(document => new this.Resource(document, this));
      return { total: query.total, results: results };
    });
  }

}

module.exports = Collection;
