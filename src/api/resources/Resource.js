'use strict';

const Api = require('../Api');
const network = require('../../network');
const ChannelMixin = require('./ChannelMixin');

class Resource extends ChannelMixin {

  constructor (document, context) {
    this.document = document || {};
    this.network = network.getDelegate(context);
    this.context = context;
  }

  static get (uuid, context) {
    if (!uuid) return Promise.reject(new Error('Document uuid is required.'));
    return Api.get(this.path + '/' + uuid).then(document => new this(document, context));
  }

  static create (document, options, context) {
    options = options || {};
    const resource = new this(document, context);
    if (options.save === false) {
      if (options.sync === true) return resource;
      return Promise.resolve(resource);
    }
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

  get path () {
    return this.constructor.path + '/' + this.uuid;
  }

  save () {
    return Api.patch(this.path, null, this.document).then(document => this.document = document);
  }

  get uuid () {
    return this.document.uuid;
  }

  refresh () {
    return Api.get(this.path).then(document => this.document = document);
  }




}

module.exports = Resource;
