'use strict';

const utilities = require('./utilities');
const iface = require('./interface');

const device = new utilities.DataNode({ name: 'device' });

device.refresh = () => {
  return iface.request({
    name: 'getDevice',
    target: 'system'
  });
};

module.exports = device;

