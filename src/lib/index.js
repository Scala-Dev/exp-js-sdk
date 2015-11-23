'use strict';

/**
 * Utilities
 * @namespace scala.utilities
 */

const Logger = require('./Logger');
const EventNode = require('./EventNode');
const DataNode = require('./DataNode');
const SDKError = require('./Error');

module.exports = {
  Logger: Logger,
  EventNode: EventNode,
  DataNode: DataNode,
  Error: SDKError,
  Context: require('./context')
};
