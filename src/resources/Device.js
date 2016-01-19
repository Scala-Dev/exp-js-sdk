'use strict';

const _ = require('lodash');

const Resource = require('./Resource');
const Experience = require('./Experience');
const Location = require('./Location');

class Device extends Resource {

  getExperience () {
    return Experience.get(_.get(this, 'document.experience.uuid'), this.sdk, this.context);
  }

  getLocation () {
    return Location.get(_.get(this, 'document.location.uuid'), this.sdk, this.context);
  }

  static get path () {
    return '/api/devices';
  }

  identify () {
    return this.broadcast('identify');
  }

}

module.exports = Device;
