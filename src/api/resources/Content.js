'use strict';

const Resource = require('./Resource');
const runtime = require('../../runtime');

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

  static get path () { return '/api/content'; }

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
      return runtime.auth.api.host + '/api/delivery' + Content.encodePath(this.document.path);
    } else if (this.subtype === 'scala:content:app') {
      return runtime.config.api.host + '/api/delivery' + Content.encodePath(this.document.path) + '/index.html';
    } else if (this.subtype === 'scala:content:url') {
      return this.document.url;
    }
    return null;
  }

  getVariantUrl (name) {
    if (this.subtype === 'scala:content:file' && this.hasVariant(name)) {
      const query = '?variant=' + encodeURIComponent(name);
      return runtime.auth.api.host + '/api/delivery' + Content.encodePath(this.document.path) + query;
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
