'use strict';

class Collection {

  constructor (api, context) {
    this._api = api;
    this._context = context;
  }

  get (uuid) {
    if (!uuid) return Promise.reject(new Error('Document uuid is required.'));
    return this.api.get(this._path + '/' + uuid).then(document => {
      return new this._Resource(document, this, this._context);
    });
  }

  create (document, options) {
    options = options || {};
    const resource = new this._Resource(document, this, this._context);
    if (options.save === false) return resource;
    return this._api.post(this._path, null, resource.document).then(document => {
      resource.document = document;
      return resource;
    });
  }

  save (resource) {
    return this._api.patch(this._path + '/' + resource.uuid, null, resource.document);
  }

  find (params) {
    return this._api.get(this._path, params).then(query => {
      const results = query.results.map(document => new this._Resource(document, this));
      return { total: query.total, results: results };
    });
  }

}

module.exports = Collection;
