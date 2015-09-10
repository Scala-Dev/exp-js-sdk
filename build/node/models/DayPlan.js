'use strict';

module.exports = function (document, experience) {

  var Block = require('./Block');

  this.document = document;
  this.getBlocks = function () {
    return Promise.resolve(document.blocks.map(function (block) {
      return new Block(block, experience);
    }));
  };
};