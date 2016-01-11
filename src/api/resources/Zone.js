'use strict';

const exp = require('exp-js-sdk');
const ChannelMixin = require('./ChannelMixin');

class Zone extends ChannelMixin {

  constructor (document, location, context) {
    super();
    this.document = document;
    this.location = location;
    this.network = exp.network.getDelegate(context);
    this.api = exp.api.getDelegate(context);
    this.context = context;
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
    return this.api.getDevices({ 'location.uuid' : this.location.uuid, 'location.zones.key': this.key });
  }

  getLocation () {
    return Promise.resolve(this.location);
  }

  getChannel () {
    return this.network.getChannel(this.location.uuid + ':zone:' + this.key);
  }

}

module.exports = Zone;
