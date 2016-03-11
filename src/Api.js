'use strict';

const fetch = require('isomorphic-fetch');
const _ = require('lodash');

class Resource {

  constructor (document, exists, sdk, context) {
    this.document = document || {};
    this._context = context;
    this._exists = exists;
    this._sdk = sdk;
  }

  static get (uuid, sdk, context) {
    if (!uuid) return Promise.reject(new Error('Document uuid is required.'));
    return sdk.api.get(this.path + '/' + encodeURIComponent(uuid)).then(document => new this(document, true, sdk, context));
  }

  static create (document, sdk, context) {
    return Promise.resolve(new this(document, false, sdk, context));
  }

  static find (params, sdk, context) {
    return sdk.api.get(this._getPath(), params).then(query => query.results.map(document => new this(document, true, sdk, context)));
  }

  _hasPath () {
    return !!this.document && !!this.document.uuid;
  }

  _getPath () {
    return this.constructor._getPath() + '/' + this.document.uuid;
  }

  static _getPath () {
    throw new Error('Not implemented.');
  }

  _saveExisting () {
    return this._sdk.api.patch(this._getPath(), null, this.document).then(document => {
      this.document = document;
      return this;
    });
  }

  _saveNew () {
    return this._sdk.api.post(this.constructor._getPath(), null, this.document).then(document => {
      this.document = document;
      this._exists = true;
      return this;
    });
  }

  save () {
    if (this._exists) return this._saveExisting();
    else return this._saveNew();
  }

  refresh () {
    return this._sdk.api.get(this.path).then(document => this.document = document);
  }

  getChannel (options) {
    return this._sdk.network.getChannel(this._getChannelName(), options, this._context);
  }

  _getChannelName () {
    return this.document.uuid;
  }

  fling (payload, options) {
    return this.getChannel(options).broadcast('fling', payload);
  }

  clone (context) {
    return new this.constructor(this.document, this._exists, this._sdk, context);
  }

}


class Device extends Resource {

  static _getPath () {
    return '/api/devices';
  }

  getExperience () {
    const uuid = _.get(this, 'document.experience.uuid');
    if (!uuid) return Promise.reject('Device has no experience.');
    return this._sdk.api.Experience.get(uuid, this._sdk, this.context);
  }

  getLocation () {
    const uuid = _.get(this, 'document.location.uuid');
    if (!uuid) return Promise.reject('Device has no location.');
    return this._sdk.api.Location.get(_.get(this, 'document.location.uuid'), this._sdk, this.context);
  }

  identify () {
    return this.getChannel().broadcast('identify', null, 500);
  }

}


class Thing extends Device {

  static _getPath () {
    return '/api/things';
  }

}


class Experience extends Resource {

  static _getPath () {
    return '/api/experiences';
  }

}

class Zone extends Resource {

  constructor (document, location, exists, sdk, context) {
    super(document, sdk, exists, context);
    this._location = location;
  }

  save () {
    return this._location.save();
  }

  refresh () {
    throw new Error('Not implemented.');
  }

  getLocation () {
    return Promise.resolve(this._location);
  }

  _getChannelName () {
    return this._location.document.uuid + ':zone:' + this.document.key;
  }

  clone (context) {
    return new this.constructor(this.document, this._location, this._exists, this._sdk, context);
  }

}


class Location extends Resource {

  static _getPath () {
    return '/api/locations';
  }

  getZones () {
    if (!this.document.zones) return Promise.resolve([]);
    return Promise.resolve(this.document.zones.map(document => {
      return new Zone(document, this, this._exists, this._sdk, this._context);
    }));
  }

  getZone (key) {
    if (!this.document.zones) return Promise.reject(new Error('Zone not found.'));
    const document = this.document.zones.find(zone => zone.key === key);
    if (!document) return Promise.reject(new Error('Zone not found'));
    return Promise.resolve(new this._sdk.api.Zone(document, this, this._exists, this._sdk, this._context));
  }

  getLayoutUrl () {
    return this.getPath() + '/layout?_rt=' + this._sdk.authenticator.getAuthSync().restrictedToken;
  }

}


class Feed extends Resource {

  static _getPath () {
    return '/api/connectors/feeds';
  }

  getData () {
    return this._sdk.api.get(this._getPath() + '/data');
  }

}



class Data extends Resource {

  static _getPath () {
    return '/api/data';
  }

  _getPath () {
    return this.constructor._getPath() + '/' + encodeURIComponent(this.document.group) + '/' + encodeURIComponent(this.document.key);
  }

  get value () {
    return this.document.value;
  }

  set value (value) {
    this.document.value = value;
  }

  save () {
    return this._sdk.api.put(this._getPath(), null, this.document).then(document => this.document = document);
  }

  static get (key, group, sdk, context) {
    group = group || 'default';
    if (!key) return Promise.reject(new Error('Key is required.'));
    const data = new this({ key: key, group: group }, true, sdk, context);
    data.refresh().then(() => data);
  }

  getChannelName () {
    return 'data' + ':' + this.document.key + ':' + this.document.group;
  }

}


class Content extends Resource {

  constructor (document, exists, sdk, context) {
    super(document, exists, sdk, context);
  }

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

  get subtype () {
    return this.document.subtype;
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
    if (params) path += this.encodeQueryString(params);
    if (typeof options.body === 'object') options.body = JSON.stringify(options.body);
    return this._sdk.authenticator.getAuth().then(auth => {
      options.cors = true;
      options.credentials = 'include';
      options.headers = options.headers || {};
      options.headers.Authorization = 'Bearer ' + auth.token;
      options.headers.Accept = 'application/json';
      return fetch(auth.api.host + path, options).then(response => {
        return response.json().then(body => {
          if (!response.ok) throw new Error(body.code || 'An Unknown error has occured.');
          return body;
        });
      });
    });
  }

  get (path, params) {
    return this.fetch(path, params, { method: 'get' });
  }

  post (path, params, body) {
    const options = { method: 'post', headers:  { 'Content-Type': 'application/json' }, body: body };
    return this.fetch(path, params, options);
  }

  put (path, params, body) {
    const options = { method: 'put', headers:  { 'Content-Type': 'application/json' }, body: body };
    return this.fetch(path, params, options);
  }

  patch (path, params, body) {
    const options = { method: 'patch', headers:  { 'Content-Type': 'application/json' }, body: body };
    return this.fetch(path, params, options);
  }

  delete (path, params) {
    if (params) path += this.encodeQueryString(params);
    return this.fetch(path, { method: 'delete' });
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