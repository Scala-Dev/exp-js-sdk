'use strict';

const Experience = require('./Experience');
const Plan = require('./Plan');

/**
 * App Object
 * @namespace App
 * @property {string} uuid The app's UUID.
 * @property {string} url The app's URL.
 */

module.exports = function (context) {
  this.uuid = context.app.uuid;
  this.url = context.app.url;

  /**
   * Get the App's Config
   * @method getConfig
   * @memberOf App
   * @returns {Promise} The app's config.
   */
  this.getConfig = () => {
    return Promise.resolve(context.app.config);
  };

  /**
   * Get the App's Experience
   * @method getExperience
   * @memberOf App
   * @returns {Promise} An [Experience Object]{@link Experience}
   */
  this.getExperience = () => {
    return Promise.resolve(new Experience({ experience: context.experience }));
  };

  /**
   * Get the App's Plans
   * @method getPlans
   * @memberOf App
   * @returns {Promise} A [Plan Object]{@link Plan}
   */
  this.getPlans = () => {
    const plans = [];
    context.experience.plans.forEach(plan => {
      if (plan.appUuid === context.app.uuid) {
        plans.push(new Plan({ plan: plan, experience: context.experience }));
      }
    });
    return Promise.resolve(plans);
  };
};


