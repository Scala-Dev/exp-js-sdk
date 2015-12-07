'use strict';

class Resource {

  constructor (document, collection) {
    this.document = document;
    this._collection = collection;
  }

  get uuid () {
    return this.document.uuid;
  }

  save () {
    this._collection.save(this);
  }

  refresh () {
    return this._collection.get(this.uuid).then(resource => {
      this.document = resource.document;
    });
  }

  on (name, callback) {
    return exp.network.getChannel(name, { system: true }).listen(name, callback);
  }

}

module.exports = Resource;
