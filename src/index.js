'use strict';

const Sdk = require('./Sdk');
const sdk = new Sdk();

const Delegate = require('./Delegate');
const delegate = new Delegate(sdk);

if (typeof window === 'object') window.exp = delegate;

module.exports = delegate;
