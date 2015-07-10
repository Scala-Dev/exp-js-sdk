'use strict';

/**
 * Abstraction to handle event binding and triggering.
 * @name EventNode
 * @class EventNode
 * @memberof scala.utilities
 */

function EventNode () {
  this.map = {};

  /**
   * Attach a callback function to a named event.
   * @name on
   * @method
   * @instance
   * @memberof scala.utilities.EventNode
   * @param {string} name The name of the event.
   * @param {function} callback The callback to bind to this event.
   * @returns {function} Method that cancels the callback from firing when the event is triggered.
   */  

  this.on = (name, callback) => {
    if (!this.map[name]) this.map[name] = [];
    this.map[name].push(callback);
    return () => this.map[name].splice(this.map[name].indexOf(callback), 1);
  };

  /**
   * Trigger an event.
   * @name trigger
   * @method
   * @instance
   * @memberof scala.utilities.EventNode
   * @param {string} name Event name
   * @param {object} payload Event payload
   * @returns {Promise} Promise created by aggregate of registered callbacks.
   */

  this.trigger = (name, payload) => {
    var promises = [];
    (this.map[name] || []).forEach(callback => promises.push(callback(payload)));
    return Promise.all(promises);  
  };

}

module.exports = EventNode;
