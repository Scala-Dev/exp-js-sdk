'use strict';

module.exports = class SdkError extends Error {
  constructor (code) {
    super(code);
    this.code = code;
    this.name = code;
    this.stack = (new Error()).stack;
  }
};
