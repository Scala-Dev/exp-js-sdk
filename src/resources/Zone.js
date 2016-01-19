'use strict';

const Resource = require('./Resource');

class Zone extends Resource {

  constructor (document, location, sdk, context) {
    super(document, sdk, context);
    this.location = location;
  }

  get name () {
    return this.document.name;
  }

  set name (name) {
    this.document.name = name;
  }

  get key () {
    return this.document.key;
  }

  set key (key) {
    this.document.key = key;
  }

  save () {
    return this.location.save();
  }

  getDevices () {
    return this.sdk.api.getDevices({ 'location.uuid' : this.location.uuid, 'location.zones.key': this.key });
  }

  getLocation () {
    return Promise.resolve(this.location);
  }

  getChannelName () {
    return this.location.uuid + ':zone:' + this.key;
  }

}

module.exports = Zone;
