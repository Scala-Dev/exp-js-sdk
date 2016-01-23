'use strict';

const _ = require('lodash');

const Resource = require('./Resource');
const Experience = require('./Experience');
const Location = require('./Location');

class Device extends Resource {

  getExperience () {
    return Experience.get(_.get(this, 'document.experience.uuid'), this.context);
  }

  getLocation () {
    return Location.get(_.get(this, 'document.location.uuid'), this.context);
  }

  static get path () {
    return '/api/devices';
  }

  identify (payload, options) {
    return this.getChannel(options).broadcast('identify', payload);
  }

}

module.exports = Device;
