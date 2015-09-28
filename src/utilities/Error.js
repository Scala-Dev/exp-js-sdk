'use strict';

function SDKError (code, message) {
  this.name = 'SDKError';
  this.code = code;
  this.message = message;
  this.stack = Error(message).stack;
}

SDKError.prototype = Object.create(Error.prototype);
SDKError.prototype.constructor = SDKError;

module.exports = SDKError;
