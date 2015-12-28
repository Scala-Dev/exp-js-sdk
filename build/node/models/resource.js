'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var bus = require('../bus');

module.exports = (function () {
  function Resource(document, context) {
    _classCallCheck(this, Resource);

    this.document = document;
    this.context = context;
  }

  _createClass(Resource, [{
    key: 'on',
    value: function on(name, callback) {
      return bus.getChannel(this.uuid).listen(name, callback);
    }
  }, {
    key: 'uuid',
    get: function get() {
      return this.document.uuid;
    }
  }, {
    key: 'created',
    get: function get() {
      return this.document.created;
    }
  }, {
    key: 'lastModified',
    get: function get() {
      return this.document.lastModified;
    }
  }, {
    key: 'metadata',
    get: function get() {
      return this.document.metadata;
    },
    set: function set(metadata) {
      this.document.metadata = metadata;
    }
  }, {
    key: 'labels',
    get: function get() {
      return this.document.labels;
    },
    set: function set(labels) {
      this.document.labels = labels;
    }
  }]);

  return Resource;
})();