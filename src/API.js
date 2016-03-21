'use strict';

const fetch = require('isomorphic-fetch');
const _ = require('lodash');


class Resource {

  constructor (document, sdk, context) {
    this.document = document;
    this._sdk = sdk;
    this._context = context;
  }

  static create (document, sdk, context) {
    return sdk.api.post(this.getCollectionPath(document), document).then(document => new this(document, sdk, context));
  }

  static get (uuid, sdk, context) {
    if (!uuid) return Promise.resolve(null);
    return sdk.api.get(this.getResourcePath({ uuid: uuid })).then(document => new this(document, sdk, context)).catch(error => {
      if (error && error.status === 404) return null;
      throw error;
    });
  }

  static find (params, sdk, context) {
    return sdk.api.get(this.getCollectionPath(), params).then(query => query.results.map(document => new this(document, sdk, context)));
  }

  static getCollectionPath () { return '/api/resources'; }
  static getResourcePath (document) { return this.getCollectionPath() + '/' + encodeURIComponent(document.uuid); }
  static getChannelName (document) { return document.uuid; }

  save () {
    return this._sdk.api.patch(this.constructor.getResourcePath(this.document), this.document).then(document => this.document = document);
  }

  fling (payload, options, timeout) {
    return this.getChannel(options).fling(payload, timeout);
  }

  refresh () {
    return this._sdk.api.get(this.constructor.getResourcePath(this.document)).then(document => this.document = document);
  }

  getChannel (options) {
    return this._sdk.network.getChannel(this.constructor.getChannelName(this.document), options, this._context);
  }

  clone (context) {
    return new this.constructor(this.document, this._sdk, context || this._context);
  }

}


/* Devices */

class Device extends Resource {

  static getCollectionPath () { return '/api/devices'; }

  getExperience () {
    return this._sdk.api.Experience.get(_.get(this, 'document.experience.uuid'), this._sdk, this.context);
  }

  getLocation () {
    return this._sdk.api.Location.get(_.get(this, 'document.location.uuid'), this._sdk, this.context);
  }

  getZones () {
    return this.getLocation().then(location => {
      if (!location) return [];
      return location.document.zones.filter(locationZoneDocument => {
        return this.document.location.zones.find(deviceZoneDocument => deviceZoneDocument.key === locationZoneDocument.key);
      }).map(document => new this._sdk.api.Zone(document, location, this._sdk, this._context));
    });
  }

  identify () {
    return this.getChannel().broadcast('identify', null, 500);
  }

}

/* Things */

class Thing extends Device {

  static getCollectionPath () { return '/api/things'; }

}

Thing.identify = undefined;
Thing.getExperience = undefined;



/* Experiences */

class Experience extends Resource {

  static getCollectionPath () { return '/api/experiences'; }

  getDevices () {
    return this._sdk.api.Device.find({ 'experience.uuid' : this.document.uuid }, this._sdk, this._context);
  }

}



/* Locations */

class Location extends Resource {

  static getCollectionPath () { return '/api/locations'; }

  getDevices () {
    return this._sdk.api.Device.find({ 'location.uuid': this.document.uuid }, this._sdk, this._context);
  }

  getThings () {
    return this._sdk.api.Thing.find({ 'location.uuid': this.document.uuid }, this._sdk, this._context);
  }

  getZones () {
    if (!this.document.zones) return Promise.resolve([]);
    return Promise.resolve(this.document.zones.map(document => {
      return new this._sdk.api.Zone(document, this, this._sdk, this._context);
    }));
  }

  getLayoutUrl () {
    return this.constructor.getResourcePath(this.document) + '/layout?_rt=' + this._sdk.authenticator.getAuthSync().restrictedToken;
  }

}



class Zone extends Resource {

  constructor (document, location, sdk, context) {
    super(document, sdk, context);
    this._location = location;
  }

  save () {
    return this._location.save();
  }

  refresh () {
    return this._location.refresh().then(() => {
      const key = this.document.key;
      this.document = (this._location.document.zones || []).find(document => document.key === key);
    });
  }

  getLocation () {
    return Promise.resolve(this._location);
  }

  getDevices () {
    return this._sdk.api.Device.find({ 'location.uuid' : this._location.document.uuid, 'location.zones.key': this.document.key }, this._sdk, this._context);
  }

  getThings () {
    return this._sdk.api.Thing.find({ 'location.uuid' : this._location.document.uuid, 'location.zones.key': this.document.key }, this._sdk, this._context);
  }

  _getChannelName () {
    return this._location.document.uuid + ':zone:' + this.document.key;
  }

  clone (context) {
    return new this.constructor(this.document, this._location, this._exists, this._sdk, context);
  }

}



class Feed extends Resource {

  static getCollectionPath () { return '/api/connectors/feeds'; }

  getData () { return this._sdk.api.get(this.constructor.getResourcePath(this.document) + '/data'); }

}



class Data extends Resource {

  static getCollectionPath () { return '/api/data'; }

  static getResourcePath (document) {
    return this.constructor.getCollectionPath() + '/' + encodeURIComponent(document.group || 'default') + '/' + encodeURIComponent(document.key);
  }

  save () {
    return this._sdk.api.put(this.getResourcePath(this.document), null, this.document).then(document => this.document = document);
  }

  getChannelName () {
    return 'data' + ':' + this.document.key + ':' + this.document.group || 'default';
  }

}


class Content extends Resource {

  static _encodePath (value) {
    return encodeURI(value)
      .replace('!', '%21')
      .replace('#', '%23')
      .replace('$', '%24')
      .replace('&', '%26')
      .replace('\'', '%27')
      .replace('(', '%28')
      .replace(')', '%29')
      .replace(',', '%2C')
      .replace(':', '%3A')
      .replace(';', '%3B')
      .replace('=', '%3D')
      .replace('?', '%3F')
      .replace('~', '%7E');
  }

  static _getPath () {
    return '/api/content';
  }

  getChildren () {
    if (this.document.itemCount !== this._children.length) {
      return this.refresh().then(() => this.getChildren());
    } else {
      return Promise.resolve(this._children.map(child => new this.constructor(child, true, this._sdk, this._context)));
    }
  }

  getUrl () {
    const auth = this._sdk.authenticator.getAuthSync();
    if (this.subtype === 'scala:content:file') {
      return auth.api.host + '/api/delivery' + Content.encodePath(this.document.path) + '?_rt=' + auth.restrictedToken;
    } else if (this.subtype === 'scala:content:app') {
      return auth.config.api.host + '/api/delivery' + Content.encodePath(this.document.path) + '/index.html?_rt=' + auth.restrictedToken;
    } else if (this.subtype === 'scala:content:url') {
      return this.document.url;
    }
    throw new Error('Content item does not have a url.');
  }

  getVariantUrl (name) {
    const auth = this._sdk.authenticator.getAuthSync();
    if (this.subtype === 'scala:content:file' && this.hasVariant(name)) {
      const query = '?variant=' + encodeURIComponent(name) + '&_rt=' + auth.restrictedToken;
      return auth.api.host + '/api/delivery' + Content.encodePath(this.document.path) + query;
    }
    throw new Error('Variant does not exist.');
  }

  hasVariant (name) {
    return this.document.variants && this.document.variants.some(element => {
      return element.name === name;
    });
  }
}

class ApiError extends Error {
  constructor (message, code, status) {
    super(message);
    this.message = message;
    this.code = code || null;
    this.status = status || null;
  }
}

class Api {

  constructor (sdk) {
    this._sdk = sdk;
    this.Device = Device;
    this.Experience = Experience;
    this.Thing = Thing;
    this.Zone = Zone;
    this.Location = Location;
    this.Feed = Feed;
    this.Data = Data;
    this.Content = Content;
  }

  fetch (path, params, options) {
    options = options || {};
    if (params) path += this.encodeQueryString(params);
    if (typeof options.body === 'object') options.body = JSON.stringify(options.body);
    return this._sdk.authenticator.getAuth().then(auth => {
      options.cors = true;
      options.credentials = 'include';
      options.headers = options.headers || {};
      options.headers.Authorization = 'Bearer ' + auth.token;
      options.headers.Accept = 'application/json';
      return fetch(auth.api.host + path, options).then(response => {
        if (options.method === 'delete') return Promise.resolve();
        return response.json().then(body => {
          if (!response.ok) {
            if (body) {
              throw new ApiError(body.message, body.code, response.status);
            } else {
              throw new ApiError('An unknown error has occured.');
            }
          }
          return body;
        });
      });
    });
  }

  get (path, params) {
    return this.fetch(path, params, { method: 'get' });
  }

  post (path, body, params) {
    const options = { method: 'post', headers:  { 'Content-Type': 'application/json' }, body: body };
    return this.fetch(path, params, options);
  }

  put (path, body, params) {
    const options = { method: 'put', headers:  { 'Content-Type': 'application/json' }, body: body };
    return this.fetch(path, params, options);
  }

  patch (path, body, params) {
    const options = { method: 'patch', headers:  { 'Content-Type': 'application/json' }, body: body };
    return this.fetch(path, params, options);
  }

  delete (path, params) {
    if (params) path += this.encodeQueryString(params);
    return this.fetch(path, null, { method: 'delete' });
  }

  encodeQueryString (params) {
    let parts = [];
    Object.keys(params).forEach(name => {
      parts.push(encodeURIComponent(name) + '=' + encodeURIComponent(params[name]));
    });
    return '?' + parts.join('&');
  }

}



module.exports = Api;