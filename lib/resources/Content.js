'use strict';

const Resource = require('../utils/Resource');
const runtime = require('../components/Runtime');

class Content extends Resource {

  constructor (document, collection) {
    super(document, collection);
    this.children = [];
    if (this.document.children && this.document.children.length === this.document.itemCount) {
      this.document.children.forEach(child => {
        this.children.push(new Content(child, collection));
      });
    }
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


  getChildren () {
    if (this.document.itemCount !== this.children.length) {
      return this._collection.api.getContent(this.uuid)
        .then(content => {
          this.document = content.document;
          this.children = content.children;
          return this.children;
        });
    } else {
      return Promise.resolve(this.children);
    }
  }

  getUrl () {
    if (this.subtype === 'scala:content:file') {
      return runtime.config.api.host + '/api/delivery' + Content.encodePath(this.document.path);
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
      return runtime.config.api.host + '/api/delivery' + Content.encodePath(this.document.path) + query;
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
