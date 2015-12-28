'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Channel = require('./channel');
var socket = require('./socket');

var channels = {};

var Bus = (function () {
  function Bus() {
    _classCallCheck(this, Bus);
  }

  _createClass(Bus, [{
    key: 'getChannel',
    value: function getChannel(name) {
      if (channels[name]) return channels[name];
      var channel = new Channel(name);
      channels[name] = channel;
      return channel;
    }
  }]);

  return Bus;
})();

socket.events.on('message', function (message) {
  if (message.version !== 2) return;
  if (!channels[message.channel]) return;
  channels[message.channel].onMessageReceived(message);
});

module.exports = new Bus();