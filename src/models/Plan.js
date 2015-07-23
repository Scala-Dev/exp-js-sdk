'use strict';

const api = require('../api');
const Device = require('./Device');
const App = require('./App');
const Experience = require('./Experience');

/**
 * Plan Object
 * @namespace Plan
 * @property {string} uuid The plans's UUID.
 */

module.exports = function (context) {
  this.uuid = context.plan.uuid;

  /**
   * Get the Plan's Experience
   * @method getExperience
   * @memberOf Plan
   * @returns {Promise} An [Experience Object]{@link Experience}
   */
  this.getExperience = () => {
    return Promise.resolve(new Experience({ experience: context.experience }));
  };

  /**
   * Get the Plan's Device (NOT FOR PAIRING DEVICES FOR NOW)
   * @method getDevice
   * @memberOf Plan
   * @returns {Promise} A [Device Object]{@link Device}
   */
  this.getDevice = () => {
    // This doesn't work for pairing devices. Use event bus instead?
    return Promise.resolve()
      .then(() => api.get('/api/devices/' + context.plan.deviceUuid))
      .then(device => new Device({ device: device }));
  };

  /**
   * Get the Plan's App
   * @method getApp
   * @memberOf Plan
   * @returns {Promise} An [App Object]{@link App}
   */
  this.getApp = () => {
    var app;
    context.experience.apps.forEach(app_ => {
      if (app_.uuid === context.plan.appUuid) {
        app = new App({ 
          app: app_,
          experience: context.experience
        });
      }
    });
    return Promise.resolve(app);
  };
};


