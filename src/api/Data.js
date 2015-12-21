'use strict';

const Resource = require('./Resource');
const Api = require('./Api');

class Data extends Resource {

  static get path () {
    return '/1/data';
  }

  get path () {
    return this.constructor.path + '/' + this.document.group + '/' + this.document.key;
  }

  get group () {
    return this.document.group;
  }

  get key () {
    return this.document.key;
  }

  get value () {
    return this.document.value;
  }

  static get (key, group, context) {
    if (!key || !group) return Promise.reject(new Error('Key and group are required.'));
    return Api.get(this.path + '/' + key + '/' + group).then(document => {
      return new this(document, context);
    });
  }

  static create (document, options, context) {
    options = options || {};
    const resource = new this(document, context);
    if (options.save === false) return resource;
    return Api.post(this.path + '/' + document.key + '/' + document.group, null, resource.document).then(document => {
      resource.document = document;
      return resource;
    });
  }

  get uuid () {
    return 'data' + ':' + this.key + ':' + this.group;
  }

}

module.exports = Data;
