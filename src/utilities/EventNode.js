'use strict';

function EventNode () {
  const self = this;
  this.map = {};

  this.on = (name, callback) => {
    if (!self.map[name]) self.map[name] = [];
    self.map[name].push(callback);
    return () => self.map[name].splice(self.map[name].indexOf(callback), 1);
  };

  this.trigger = (name, payload) => {
    var promises = [];
    (self.map[name] || []).forEach(callback => promises.push(callback(payload)));
    return Promise.all(promises);  
  };

}

module.exports = EventNode;
