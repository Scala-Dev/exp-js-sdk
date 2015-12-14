'use strict';

const _ = require('lodash');

const Resource = require('../lib/Resource');

class Device extends Resource {

  getExperience () {
    return this._collection.api.getExperience(_.get(this, 'document.experience.uuid'));
  }

  getLocation () {
    return this._collection.api.getLocation(_.get(this, 'document.location.uuid'));
   }

  identify () {
    return this._collection.network.getChannel(this.uuid).broadcast('identify');
  }

}

module.exports = Device;
