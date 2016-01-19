'use strict';

const Resource = require('./Resource');

class Data extends Resource {

  static get path () {
    return '/api/data';
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

  set value (value) {
    this.document.value = value;
  }

  static get (key, group, sdk, context) {
    if (!key || !group) return Promise.reject(new Error('Key and group are required.'));
    return this.api.get(this.path + '/' + key + '/' + group).then(document => {
      return new this(document, sdk, context);
    });
  }

  static create (document, options, sdk, context) {
    options = options || {};
    const resource = new this(document, sdk, context);
    if (options.save === false) return resource;
    return this.api.post(this.path + '/' + document.key + '/' + document.group, null, resource.document).then(document => {
      resource.document = document;
      return resource;
    });
  }

  getChannel () {
    return 'data' + ':' + this.key + ':' + this.group;
  }

}

module.exports = Data;
