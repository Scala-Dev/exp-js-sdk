'use strict';

const api = require('../api');
const network = require('../network');

class Resource {

  constructor (document, context) {
    this.document = document || {};
    this.api = api;
    this.network = network;
    this.context = context;
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


 listen (name, callback, options) {
    return this.getChannel().listen(name, callback, options);
  }

  broadcast (name, payload) {
    return this.getChannel().broadcast(name, payload);
  }

  request (target, name, payload) {
    return this.getChannel().request(target, name, payload);
  }

  respond (name, options, callback) {
    return this.getChannel().respond(name, options, callback);
  }

  getChannel () {
    return this.network.getChannel(this.getChannelName()).getDelgate(this.context);
  }

  getChannelName () {
    return this.uuid;
  }

  fling (options) {
    return this.getChannel().broadcast('fling', options);
  }



}

module.exports = Resource;
