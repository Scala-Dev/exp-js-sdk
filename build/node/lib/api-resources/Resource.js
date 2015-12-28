'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function Resource(document, options) {
    _classCallCheck(this, Resource);

    this.document = document || {};
    this.document.tags = this.document.tags || [];
    this.document.metadata = this.document.metadata || {};
    this.options = options || {};
  }

  _createClass(Resource, [{
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
    key: 'tags',
    get: function get() {
      return this.document.tags;
    },
    set: function set(tags) {
      this.document.tags = tags;
    }
  }]);

  return Resource;
})();