'use strict';

class Resource {

  constructor (document, collection) {
    this.document = document || {};
    this._collection = collection;
  }

  get uuid () {
    return this.document.uuid;
  }

  save () {
    return this._collection.save(this).then(document => {
      this.document = document;
      return this;
    });
  }

  refresh () {
    return this._collection.get(this.uuid).then(resource => {
      this.document = resource.document;
    });
  }

  on (name, callback) {
    return this._collection.network.getChannel(this.uuid, { system: true }).listen(name, callback);
  }

  fling (options) {
    return this._collection.network.getChannel(this.uuid).broadcast('fling', options);
  }

  getChannel (options) {
    return this._collection.network.getChannel(this.uuid, options);
  }

}

module.exports = Resource;
