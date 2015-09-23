'use strict';

module.exports = function (context) {

  this.uuid = context.experience.uuid;

  // TODO: Expose subdocs through API Objects?
  // Are we breaking out subdocs?
  this.raw = context.experience;
  this.document = context.experience;

};



