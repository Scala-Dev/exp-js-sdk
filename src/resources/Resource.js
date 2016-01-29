'use strict';

const api = require('../api');
const ChannelDelegate = require('../ChannelDelegate');

class Resource {

  constructor (document, context) {
    this.document = document || {};
    this.context = context;
  }

  static get path () {
    throw new Error('Not implemented.');
  }

  static get (uuid, context) {
    if (!uuid) return Promise.reject(new Error('Document uuid is required.'));
    return api.get(this.path + '/' + uuid).then(document => new this(document, context));
  }

  static create (document, options, context) {
    options = options || {};
    const resource = new this(document, context);
    if (options.save === false) {
      if (options.sync === true) return resource;
      return Promise.resolve(resource);
    }
    return api.post(this.path, null, resource.document).then(document => {
      resource.document = document;
      return resource;
    });
  }

  static find (params, context) {
    return api.get(this.path, params).then(query => {
      const results = query.results.map(document => new this(document, context));
      return { total: query.total, results: results };
    });
  }

  get path () {
    return this.constructor.path + '/' + this.uuid;
  }

  save () {
    return api.patch(this.path, null, this.document).then(document => this.document = document);
  }

  get uuid () {
    return this.document.uuid;
  }

  refresh () {
    return api.get(this.path).then(document => this.document = document);
  }

  getChannel (options) {
    return new ChannelDelegate(this.getChannelName(), options, this.context);
  }

  getChannelName () {
    return this.uuid;
  }

  fling (payload, options) {
    return this.getChannel(options).broadcast('fling', payload);
  }

  clone (context) {
    return new this.constructor(this.document, context);
  }

}

module.exports = Resource;
