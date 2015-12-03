'use strict';

const bus = require('../bus');

module.exports = class Resource {

  constructor (document, context) {
    this.document = document;
    this.context = context;
  }

  get uuid () { return this.document.uuid; }
  get created () { return this.document.created; }
  get lastModified () { return this.document.lastModified; }

  get metadata () { return this.document.metadata; }
  set metadata (metadata) { this.document.metadata = metadata; }

  get labels () { return this.document.labels; }
  set labels (labels) { this.document.labels = labels; }

  on (name, callback) {
    return bus.getChannel(this.uuid).listen(name, callback);
  }

  refresh () {
    return Promise.reject('Not implemented');
  }

};
