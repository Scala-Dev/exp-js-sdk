'use strict';

var Exp = require('./dist/node/Exp');
var exp = new Exp();

if (typeof window === 'object') window.exp = exp;

module.exports = exp;