'use strict';

const Sdk = require('./sdk');
const Delegate = require('./Delegate');

const exp = new Delegate(new Sdk());

if (typeof window === 'object') window.exp = exp;

module.exports = exp;
