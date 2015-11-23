'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function Context() {
    _classCallCheck(this, Context);

    this.sdk = {
      init: require('../init'),
      config: require('../config'),
      api: require('../api'),
      connection: require('../connection'),
      channels: require('../channels'),
      utilities: require('../utilities'), // Deprecate for lib
      lib: require('../utilities'),
      runtime: require('../runtime')
    };
  }

  _createClass(Context, [{
    key: 'clear',
    value: function clear() {
      // Remove all listeners and clean up.
      console.info('(STUB) Cleaning up context.');
    }
  }]);

  return Context;
})();