'use strict';

const Collection = require('./Collection');
const Resource = require('../resources/Resource');

class Data extends Collection {

  constructor (api, context) {
    super(api, context);
    this._path = '/api/data';
    this._Resource = Resource;
  }

}

module.exports = Data;
