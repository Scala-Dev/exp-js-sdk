'use strict';

const ContentNode = function (context) {

  const self = this;
  const api = require('../api');
  const config = require('../config');

  this.uuid = context.content.uuid;
  this.document = context.content;

  this.children = [];

  if (this.document.children && this.document.children.length === this.document.itemCount) {
    this.document.children.forEach(child => {
      self.children.push(new ContentNode({ content: child }));
    });
  }

  this.getChildren = () => {
    if (this.document.itemCount != this.children.length) {
      return api.getContentNode(this.uuid)
      .then(that => {
        self.document = that.document;
        self.children = that.children;

        return self.children;
      });
    } else {
      return Promise.resolve(this.children);
    }
  };

  this.getUrl = () => {
    return config.host + '/api/delivery' + escape(this.document.path);
  };

  this.getVariantUrl = name => {
    const query = '?variant=' + encodeURIComponent(name);
    return config.host + '/api/delivery' + escape(this.document.path) + query;
  };

};

module.exports = ContentNode;
