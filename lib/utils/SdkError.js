'use strict';

const messages = {
  passwordMissing: 'Please specify a password.',
  organizationMissing: 'Please specify an organization.',
  secretMissing:'Please specify the device\'s secret',
  apiKeyMissing: 'Please specify a consumer app api key.',
  credentialsMissing: 'Please specify credentials or a token.',
  startupInterupted: 'Runtime startup was interupted by another call to start.'
};

module.exports = class SdkError extends Error {
  constructor (code, error) {
    super();
    this.code = code || 'unknown';
    this.message = messages[code] || 'An unknown error has occured.';
    if (error) this.error = error;
  }
};
