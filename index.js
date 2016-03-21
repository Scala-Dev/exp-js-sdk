'use strict';

var EXP = require('./dist/node/EXP');

if (typeof window === 'object') window.EXP = EXP;

module.exports = EXP;