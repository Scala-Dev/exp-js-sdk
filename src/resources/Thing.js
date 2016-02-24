'use strict';

const _ = require('lodash');

const Resource = require('./Resource');
const Experience = require('./Experience');
const Location = require('./Location');

class Thing extends Resource {

  getExperience () {
    return Experience.get(_.get(this, 'document.experience.uuid'), this.context);
  }

  getLocation () {
    return Location.get(_.get(this, 'document.location.uuid'), this.context);
  }

  static get path () {
    return '/api/things';
  }

}

module.exports = Thing;
