'use strict';

var ContentNode = function ContentNode(context) {
  var _this = this;

  var self = this;
  var api = require('../api');
  var config = require('../config');

  this.uuid = context.content.uuid;
  this.document = context.content;

  this.children = [];

  if (this.document.children && this.document.children.length === this.document.itemCount) {
    this.document.children.forEach(function (child) {
      self.children.push(new ContentNode({ content: child }));
    });
  }

  this.getChildren = function () {
    if (_this.document.itemCount != _this.children.length) {
      return api.getContentNode(_this.uuid).then(function (that) {
        self.document = that.document;
        self.children = that.children;

        return self.children;
      });
    } else {
      return Promise.resolve(_this.children);
    }
  };

  this.getUrl = function () {
    return config.host + '/api/delivery' + escape(_this.document.path);
  };
};

module.exports = ContentNode;