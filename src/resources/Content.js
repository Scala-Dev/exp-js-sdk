'use strict';

const _ = require('lodash');
const Resource = require('./Resource');

class Content extends Resource {

  constructor (document, sdk, context) {
    super(document, sdk, context);
    this._children = _.get(document, 'children', []).map(child => new this.constructor(child, this.sdk, context));
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
    if (this.subtype === 'scala:content:file') {
      return this.sdk.auth.api.host + '/api/delivery' + Content.encodePath(this.document.path) + '?_rt=' + this.sdk.auth.readToken;
    } else if (this.subtype === 'scala:content:app') {
      return this.sdk.auth.config.api.host + '/api/delivery' + Content.encodePath(this.document.path) + '/index.html?_rt=' + this.sdk.auth.readToken;
    } else if (this.subtype === 'scala:content:url') {
      return this.document.url;
    }
    return null;
  }

  getVariantUrl (name) {
    if (this.subtype === 'scala:content:file' && this.hasVariant(name)) {
      const query = '?variant=' + encodeURIComponent(name) + '&_rt=' + this.sdk.auth.readToken;
      return this.sdk.auth.api.host + '/api/delivery' + Content.encodePath(this.document.path) + query;
    }
    return null;
  }

  hasVariant (name) {
    return this.document.variants && this.document.variants.some(element => {
      return element.name === name;
    });
  }
}

module.exports = Content;
