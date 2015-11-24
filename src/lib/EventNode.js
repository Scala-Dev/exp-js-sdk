'use strict';

function EventNode () {
  const self = this;
  this.map = {};

  this.on = (name, callback) => {
    if (!self.map[name]) self.map[name] = [];
    self.map[name].push(callback);
    const cancel = () => { self.map[name].splice(self.map[name].indexOf(callback), 1); };
    const cancel2 = () => { self.map[name].splice(self.map[name].indexOf(callback), 1); };
    cancel.cancel = cancel2;
    return cancel;
  };

  this.trigger = (name, payload) => {
    var promises = [];
    (self.map[name] || []).forEach(callback => promises.push(callback(payload)));
    return Promise.all(promises);
  };

  this.clear = () => {
    this.map = {};
  };

}

module.exports = EventNode;
