'use strict';

const iface = require('../interface');

module.exports = function (context) {

  this.uuid = context.experience.uuid;

  // TODO: Expose subdocs through API Objects.
  this.raw = context.experience;

  // Broadcast a message about this experience.
  this.broadcast = options => {
    return iface.broadcast({
      name: options.name,
      topic: options.topic,
      scope: context.experience.uuid
    });
  };

  // Listen for a message about this experience.
  this.listen = (options, callback) => {
    return iface.listen({
      name: options.name,
      topic: options.topic,
      scope: context.experience.uuid
    }, callback);
  };

};



