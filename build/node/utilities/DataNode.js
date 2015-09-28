'use strict';

/**
 * Simple data container.
 * @name DataNode
 * @class DataNode
 * @memberof scala.utilities
 */

var EventNode = require('./EventNode');
var Logger = require('./Logger');

function DataNode(options) {
  var _this = this;

  var value = null;
  var log = new Logger(options.name.charAt(0).toUpperCase() + options.name.slice(1));

  /** 
   * Event Node (see {@link scala.utilities.EventNode})
   * @namespace scala.utilities.DataNode.events
   */
  /**
   * The data has changed.
   * @memberof  scala.utilities.DataNode.events
   * @event change
   */
  this.events = new EventNode();

  /**
   * Get the value of the data node.
   * @name get
   * @method
   * @instance
   * @memberof scala.utilities.DataNode
   * @returns {Promise} Resolves to the value of the node.
   */
  this.get = function () {
    return Promise.resolve(value);
  };

  /**
   * Get the value of the data node.
   * @name set
   * @method
   * @instance
   * @memberof scala.utilities.DataNode
   * @returns {Promise} Resolves or rejects based on the result of the 'change' event listeners.
   */
  this.set = function (newValue) {
    log.trace('Set.', { value: value, newValue: newValue });
    value = newValue;
    return _this.events.trigger('change', value);
  };
}

module.exports = DataNode;