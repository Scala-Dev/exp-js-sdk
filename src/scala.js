'use strict';

/**
 * Scala 
 * @namespace scala
 */

var sdk = {
  connection: require('./connection'),
  interface: require('./interface'),
  credentials: require('./credentials'),
  api: require('./api'),
  utilities: require('./utilities')
};

if (typeof window === 'object') window.scala = sdk;

module.exports = sdk;



