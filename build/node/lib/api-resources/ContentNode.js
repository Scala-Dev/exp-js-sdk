'use strict';

var ContentNode = function ContentNode(context) {
  var _this = this;

  var encodePath = function encodePath(value) {
    return encodeURI(value).replace('!', '%21').replace('#', '%23').replace('$', '%24').replace('&', '%26').replace('\'', '%27').replace('(', '%28').replace(')', '%29').replace(',', '%2C').replace(':', '%3A').replace(';', '%3B').replace('=', '%3D').replace('?', '%3F').replace('~', '%7E');
  };

  var self = this;
  var api = require('../../api');
  var config = require('../../config');

  this.uuid = context.content.uuid;
  this.document = context.content;
  this.subtype = this.document.subtype;

  this.children = [];

  if (this.document.children && this.document.children.length === this.document.itemCount) {
    this.document.children.forEach(function (child) {
      self.children.push(new ContentNode({ content: child }));
    });
  }

  this.getChildren = function () {
    if (_this.document.itemCount !== _this.children.length) {
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
    if (_this.subtype === 'scala:content:file') {
      return config.host + '/api/delivery' + encodePath(_this.document.path);
    } else if (_this.subtype === 'scala:content:app') {
      return config.host + '/api/delivery' + encodePath(_this.document.path) + '/index.html';
    } else if (_this.subtype === 'scala:content:url') {
      return _this.document.url;
    }

    return null;
  };

  this.getVariantUrl = function (name) {
    if (_this.subtype === 'scala:content:file' && _this.hasVariant(name)) {
      var query = '?variant=' + encodeURIComponent(name);
      return config.host + '/api/delivery' + encodePath(_this.document.path) + query;
    }

    return null;
  };

  this.hasVariant = function (name) {
    return _this.document.variants && _this.document.variants.some(function (element) {
      return element.name === name;
    });
  };
};

module.exports = ContentNode;