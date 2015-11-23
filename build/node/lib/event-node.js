'use strict';

function EventNode() {
  var self = this;
  this.map = {};

  this.on = function (name, callback) {
    if (!self.map[name]) self.map[name] = [];
    self.map[name].push(callback);
    return function () {
      return self.map[name].splice(self.map[name].indexOf(callback), 1);
    };
  };

  this.trigger = function (name, payload) {
    var promises = [];
    (self.map[name] || []).forEach(function (callback) {
      return promises.push(callback(payload));
    });
    return Promise.all(promises);
  };
}

module.exports = EventNode;