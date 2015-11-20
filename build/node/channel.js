'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

module.exports = (function () {
  function Channel(name) {
    _classCallCheck(this, Channel);

    this.name = name;
    this._listeners = {};
  }

  _createClass(Channel, [{
    key: 'broadcast',
    value: function broadcast() {
      throw new Error('Custom channel broadcasts not yet implemented.');
    }
  }, {
    key: 'listen',
    value: function listen(name, callback) {
      var _this = this;

      if (!this._listeners[name]) this._listeners[name] = [];
      this._listeners[name].push(callback);
      return function () {
        _this._listeners[name].splice(_this._listeners[name].indexOf(callback), 1);
      };
    }
  }, {
    key: 'request',
    value: function request() {
      throw new Error('Custom channel requests not yet implemented.');
    }
  }, {
    key: 'respond',
    value: function respond() {
      throw new Error('Custom channel responding not yet implemented.');
    }
  }, {
    key: 'onMessageReceived',
    value: function onMessageReceived(message) {
      if (message.type === 'broadcast') {
        this.onBroadcastReceived(message);
      }
    }
  }, {
    key: 'onBroadcastReceived',
    value: function onBroadcastReceived(message) {
      if (!this._listeners[message.name]) return;
      this._listeners[message.name].forEach(function (callback) {
        callback(message.payload, message);
      });
    }
  }]);

  return Channel;
})();