'use strict';

module.exports = class ApiError extends Error {
  constructor (payload) {
    super();
    payload = payload || {};
    this.code = payload.code || 'unknown';
    this.message = payload.message || 'An unknown error has occured.';
    this.status = payload.status || null;
  }
};
