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

const Stream = function(logger, level, type) {
  this.write = function (message, payload) {
    if (!console[type]) type = 'log';
    if (payload) {
      console[type]('[' + logger.name + ']:' + message, payload);
    } else {
      console[type]('[' + logger.name + ']:' + message);
    }
  };
};

const Logger = function(options) {
  this.name = options.name || 'Default';
  this.trace = new Stream(this, 0, 'debug').write;
  this.debug = new Stream(this, 20, 'debug').write;
  this.info = new Stream(this, 40, 'info').write;
  this.warn = new Stream(this, 60, 'warn').write;
  this.error = new Stream(this, 80, 'error').write;
  this.fatal = new Stream(this, 100, 'error').write;
};

module.exports = Logger;
