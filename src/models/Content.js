'use strict';

const Content = function (context) {

  const self = this;
  const api = require('../api');
  const config = require('../config');

  this.uuid = context.content.uuid;
  this.document = context.content;

  this.children = [];

  if (this.document.children && this.document.children.length === this.document.itemCount) {
    this.document.children.forEach(child => {
      self.children.push(new Content({ content: child }));
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
    return config.host + '/api/delivery' + this.document.path;
  };

};

module.exports = Content;
