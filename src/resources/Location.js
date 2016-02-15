'use strict';

const Resource = require('./Resource');
const Zone = require('./Zone');
const authManager = require('../authManager');

class Location extends Resource {

  static get path () {
    return '/api/locations';
  }

  getZones () {
    if (!this.document.zones) return Promise.resolve([]);
    return Promise.resolve(this.document.zones.map(zone => {
      return new Zone(zone, this, this.context);
    }));
  }

  getZone (key) {
    if (!this.document.zones) return Promise.reject(new Error('Zone not found.'));
    const document = this.document.zones.find(zone => zone.key === key);
    if (!document) return Promise.reject(new Error('Zone not found'));
    return Promise.resolve(new Zone(document, this,  this.context));
  }

  getLayoutUrl () {
    const auth = authManager.getSync();
    return this.documentPath + '/layout?_rt=' + auth.restrictedToken;
  }

}

module.exports = Location;
