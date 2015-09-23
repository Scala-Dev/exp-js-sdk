'use strict';

var Content = function Content(context) {
  var _this = this;

  var api = require('../api');
  var config = require('./config');

  this.uuid = context.content.uuid;
  this.document = context.content;

  this.children = [];

  if (this.document.children.length === this.document.itemCount) {
    this.document.children.forEach(function (child) {
      _this.children.push(new Content({ content: child }));
    });
  }

  this.getChildren = function () {
    if (_this.document.itemCount != _this.children.length) {
      var _ret = (function () {
        var self = _this;
        return {
          v: api.getContentNode(_this.uuid).then(function (that) {
            self.document = that.document;
            self.children = that.children;

            return self.children;
          })
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    } else {
      return Promise.resolve(_this.children);
    }
  };

  this.getUrl = function () {
    return config.host + '/api/delivery' + _this.document.path;
  };
};

module.exports = Content;