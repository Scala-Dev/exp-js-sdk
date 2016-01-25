'use strict';

const _ = require('lodash');
const Resource = require('./Resource');
const authManager = require('../authManager');

class Content extends Resource {

  constructor (document, context) {
    super(document, context);
    this._children = _.get(document, 'children', []).map(child => new this.constructor(child, context));
  }

  static encodePath (value) {
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

  static get path () {
    return '/api/content';
  }

  getChildren () {
    if (this.document.itemCount !== this.children.length) {
      return this.get(this.uuid).then(content => {
        this.document = content.document;
        this._children = content._children;
        return this._children;
      });
    } else {
      return Promise.resolve(this._children);
    }
  }

  getUrl () {
    return authManager.get().then(auth => {
      if (this.subtype === 'scala:content:file') {
        return auth.api.host + '/api/delivery' + Content.encodePath(this.document.path) + '?_rt=' + auth.readToken;
      } else if (this.subtype === 'scala:content:app') {
        return auth.config.api.host + '/api/delivery' + Content.encodePath(this.document.path) + '/index.html?_rt=' + auth.readToken;
      } else if (this.subtype === 'scala:content:url') {
        return this.document.url;
      }
      throw new Error('Content item does not have a url.');
    });
  }

  getVariantUrl (name) {
    return authManager.get().then(auth => {
      if (this.subtype === 'scala:content:file' && this.hasVariant(name)) {
        const query = '?variant=' + encodeURIComponent(name) + '&_rt=' + auth.readToken;
        return auth.api.host + '/api/delivery' + Content.encodePath(this.document.path) + query;
      }
      throw new Error('Variant does not exist.');
    });
  }

  hasVariant (name) {
    return this.document.variants && this.document.variants.some(element => {
      return element.name === name;
    });
  }
}

module.exports = Content;
