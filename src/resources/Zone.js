'use strict';

const Resource = require('./Resource');
const Device = require('./Device');

class Zone extends Resource {

  constructor (document, location, context) {
    super(document, context);
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
    return Device.find({ 'location.uuid' : this.location.uuid, 'location.zones.key': this.key }, this.context);
  }

  getLocation () {
    return Promise.resolve(this.location);
  }

  getChannelName () {
    return this.location.uuid + ':zone:' + this.key;
  }

  clone (context) {
    return new this.constructor(this.document, this.location, context);
  }

}

module.exports = Zone;
