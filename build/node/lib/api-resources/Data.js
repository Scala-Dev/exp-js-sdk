'use strict';

module.exports = function (context) {

  this.key = context.data.key;
  this.value = context.data.value;
  this.group = context.data.group;
  this.document = context.data;
};