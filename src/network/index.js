'use strict';

const Network = require('./Network');
const Delegate = require('./Delegate');

module.exports = new Delegate(new Network());