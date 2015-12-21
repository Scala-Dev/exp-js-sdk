'use strict';

const Api = require('./Api');
const network = require('../network');

class Resource {

  constructor (document, context) {
    this.document = document || {};
    this._network = network.getDelegate(context);
    this._context = context;
  }

  static get (uuid, context) {
    if (!uuid) return Promise.reject(new Error('Document uuid is required.'));
    return Api.get(this.path + '/' + uuid).then(document => {
      return new this(document, context);
    });
  }

  static create (document, options, context) {
    options = options || {};
    const resource = new this(document, context);
    if (options.save === false) return resource;
    return Api.post(this.path, null, resource.document).then(document => {
      resource.document = document;
      return resource;
    });
  }

  static find (params, context) {
    return Api.get(this.path, params).then(query => {
      const results = query.results.map(document => new this(document, context));
      return { total: query.total, results: results };
    });
  }

  save () {
    return Api.patch(this.path + '/' + this.uuid, null, this.document)
      .then(document => this.document = document);
  }

  get uuid () {
    return this.document.uuid;
  }

  refresh () {
    return Api.get(this.path + '/' + this.uuid).then(document => {
      this.document = document;
    });
  }

  on (name, callback) {
    return this._network.getChannel(this.uuid, { system: true }).listen(name, callback);
  }

  fling (options) {
    return this._network.getChannel(this.uuid).broadcast('fling', options);
  }

  getChannel (options) {
    return this._network.getChannel(this.uuid, options);
  }

}

module.exports = Resource;
