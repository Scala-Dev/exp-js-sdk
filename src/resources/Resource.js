'use strict';

const Channel = require('./Channel');

class Resource {

  constructor (document, sdk, context) {
    this.document = document || {};
    this.sdk = sdk;
    this.context = context;
  }

  static get path () {
    throw new Error('Not implemented.');
  }

  static get (uuid, sdk, context) {
    if (!uuid) return Promise.reject(new Error('Document uuid is required.'));
    return sdk.api.get(this.path + '/' + uuid).then(document => new this(document, sdk, context));
  }

  static create (document, options, sdk, context) {
    options = options || {};
    const resource = new this(document, sdk, context);
    if (options.save === false) {
      if (options.sync === true) return resource;
      return Promise.resolve(resource);
    }
    return sdk.api.post(this.path, null, resource.document).then(document => {
      resource.document = document;
      return resource;
    });
  }

  static find (params, sdk, context) {
    return sdk.api.get(this.path, params).then(query => {
      const results = query.results.map(document => new this(document, sdk, context));
      return { total: query.total, results: results };
    });
  }

  get path () {
    return this.constructor.path + '/' + this.uuid;
  }

  save () {
    return this.sdk.api.patch(this.path, null, this.document).then(document => this.document = document);
  }

  get uuid () {
    return this.document.uuid;
  }

  refresh () {
    return this.sdk.api.get(this.path).then(document => this.document = document);
  }

  broadcast (name, payload) {
    return this.getChannel().broadcast(name, payload);
  }

  listen (name, callback) {
    return this.getChannel().listen(name, callback);
  }

  request (target, name, payload) {
    return this.getChannel().request(target, name, payload);
  }

  respond (name, callback) {
    return this.getChannel().respond(name, callback);
  }

  getChannel () {
    return new Channel(this.getChannelName(), this.sdk, this.context);
  }

  getChannelName () {
    return this.uuid;
  }

  fling (payload) {
    return this.getChannel().broadcast('fling', payload);
  }

}

module.exports = Resource;
