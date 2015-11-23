(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var lib = require('./utilities');

var sdk = new lib.Context();

if (typeof window === 'object') window.exp = sdk;

module.exports = sdk;
},{"./utilities":6}],2:[function(require,module,exports){
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
},{"./EventNode":4,"./Logger":5}],3:[function(require,module,exports){
'use strict';

function SDKError(code, message) {
  this.name = 'SDKError';
  this.code = code;
  this.message = message;
  this.stack = Error(message).stack;
}

SDKError.prototype = Object.create(Error.prototype);
SDKError.prototype.constructor = SDKError;

module.exports = SDKError;
},{}],4:[function(require,module,exports){
'use strict';

function EventNode() {
  var self = this;
  this.map = {};

  this.on = function (name, callback) {
    if (!self.map[name]) self.map[name] = [];
    self.map[name].push(callback);
    return function () {
      return self.map[name].splice(self.map[name].indexOf(callback), 1);
    };
  };

  this.trigger = function (name, payload) {
    var promises = [];
    (self.map[name] || []).forEach(function (callback) {
      return promises.push(callback(payload));
    });
    return Promise.all(promises);
  };
}

module.exports = EventNode;
},{}],5:[function(require,module,exports){
'use strict';

/**
 * @name Logger
 * @class Logger
 * @memberof scala.utilities
 * @param {object} options
 * @param {string} options.name The name of the logger.
 */

/**
 * @name trace
 * @method
 * @instance
 * @memberof scala.utilities.Logger
 * @param {message} name The message to log.
 * @param {payload} callback The payload to log.
 */

/**
 * @name debug
 * @method
 * @instance
 * @memberof scala.utilities.Logger
 * @param {message} name The message to log.
 * @param {payload} callback The payload to log.
 */

/**
 * @name info
 * @method
 * @instance
 * @memberof scala.utilities.Logger
 * @param {message} name The message to log.
 * @param {payload} callback The payload to log.
 */

/**
 * @name warn
 * @method
 * @instance
 * @memberof scala.utilities.Logger
 * @param {message} name The message to log.
 * @param {payload} callback The payload to log.
 */

/**
 * @name error
 * @method
 * @instance
 * @memberof scala.utilities.Logger
 * @param {message} name The message to log.
 * @param {payload} callback The payload to log.
 */

/**
 * @name fatal
 * @method
 * @instance
 * @memberof scala.utilities.Logger
 * @param {message} name The message to log.
 * @param {payload} callback The payload to log.
 */

var Stream = function Stream(logger, level, type) {
  this.write = function (message, payload) {
    if (!console[type]) type = 'log';
    if (payload) {
      console[type]('[' + logger.name + ']:' + message, payload);
    } else {
      console[type]('[' + logger.name + ']:' + message);
    }
  };
};

var Logger = function Logger(options) {
  this.name = options.name || 'Default';
  this.trace = new Stream(this, 0, 'debug').write;
  this.debug = new Stream(this, 20, 'debug').write;
  this.info = new Stream(this, 40, 'info').write;
  this.warn = new Stream(this, 60, 'warn').write;
  this.error = new Stream(this, 80, 'error').write;
  this.fatal = new Stream(this, 100, 'error').write;
};

module.exports = Logger;
},{}],6:[function(require,module,exports){
'use strict';

/**
 * Utilities
 * @namespace scala.utilities
 */

var Logger = require('./Logger');
var EventNode = require('./EventNode');
var DataNode = require('./DataNode');
var SDKError = require('./Error');

module.exports = {
  Logger: Logger,
  EventNode: EventNode,
  DataNode: DataNode,
  Error: SDKError
};
},{"./DataNode":2,"./Error":3,"./EventNode":4,"./Logger":5}]},{},[1]);
