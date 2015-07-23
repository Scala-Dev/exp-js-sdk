'use strict';

const Device = require('./models/Device');
const iface = require('./interface'); 

/**
 * @method
 * @memberOf scala
 * @returns {Promise} A promise that resolves to a [Device Object]{@link Device}
 */

module.exports = () => {
  return Promise.resolve()
    .then(() => {
      return iface.request({ 
        name: 'getCurrentDevice',
        target: {
          device: 'system'
        }
      });
    })
    .then(device => new Device({ device: device }));
};
