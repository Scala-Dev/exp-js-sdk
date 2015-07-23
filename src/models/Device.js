'use strict';

const Experience = require('./Experience');
const Plan = require('./Plan');
const iface = require('../interface');

/**
 * Device Object
 * @namespace Device
 * @property {string} uuid The device's UUID.
 */

module.exports = function (context) {

  this.uuid = context.device.uuid;

  /**
   * Get the Device's Experience
   * @method getExperience
   * @memberOf Device
   * @returns {Promise} An [Experience Object]{@link Experience}
   */
  this.getExperience = () => {
    return Promise.resolve()
      .then(() => {
        // TODO: This is always the current experience!
        return iface.request({ 
          name: 'getExperience',
          target: 'system'
        });
      })
      .then(experience => new Experience({ experience: experience }));
  };

  /**
   * Get the Device's Plans
   * @method getPlans
   * @memberOf Device
   * @returns {Promise} An list of [Plan Objects]{@link Plan}
   */
  this.getPlans = () => {
    const plans = [];
    return Promise.resolve()
      .then(() => {
        // TODO: This is always the current experience!
        return iface.request({ 
          name: 'getExperience',
          target: 'system'
        });
      })
      .then(experience => {
        experience.plans.forEach(plan => {
          if (plan.deviceUuid !== context.device.uuid) return;
          plans.push(new Plan({ 
            plan: plan,
            experience: experience
          }));
        });
        return plans;
      });
  };
};


