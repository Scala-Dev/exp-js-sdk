'use strict';

const Plan = require('./Plan');
const Device = require('./Device');
const App = require('./App');

const api = require('../api');

const EventNode = require('../utilities').EventNode;
const iface = require('../interface');

const events = new EventNode();

iface.listen({ name: 'experienceUpdate' }, () => {
  events.trigger('change');
});

/**
 * Experience Object
 * @namespace Experience
 * @property {string} uuid The experiences's UUID.
 * @property {EventNode} events Fires a change event when the experience is updated. See {@link scala.utilities.EventNode}
 */

module.exports = function (context) {

  this.uuid = context.experience.uuid;

  /**
   * Get the Experiences's Plans
   * @method getPlans
   * @memberOf Experience
   * @returns {Promise} An [Plan Object]{@link Plan}
   */
  this.getPlans = () => {
    const plans = [];
    context.experience.plans.forEach(plan => {
      plans.push(new Plan({ plan: plan, experience: context.experience }));
    });
    return Promise.resolve(plans);
  };


  /**
   * Get the Experience's Apps
   * @method getApps
   * @memberOf Experience
   * @returns {Promise} A list of [App Objects]{@link App}
   */
  this.getApps = () => {
    const apps = [];
    context.experience.apps.forEach(app => {
      apps.push(new App({ app: app }));
    });
    return Promise.resolve(apps);
  };


  /**
   * Get the Experience's Devices
   * @method getDevices
   * @memberOf Experience
   * @returns {Promise} A list of [Device Objects]{@link Device}
   */
  this.getDevices = () => {
    const devices = [];
    context.experience.plans.forEach(plan => {
      devices.push(api.get('/api/devices/' + plan.deviceUuid)
                   .then(device => new Device({ device: device })));
    });
    return Promise.all(devices);
  };

  // TODO: This only fires events for the current experience. That
  // might not be good in the long run.
  this.events = events;

};



