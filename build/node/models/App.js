'use strict';

module.exports = function (document, experience) {

  var App = require('./App');

  this.document = document;
  this.startTime = document.startTime;
  this.endTime = document.endTime;

  this.getApp = function () {
    return experience.getApp(document.appKey);
  };
};