'use strict';

const utilities = require('./utilities');
const iface = require('./interface');

const experience = new utilities.DataNode({ name: 'experience' });

experience.refresh = () => {
  return iface.request({ 
    name: 'getExperience',
    target: 'system'
  });
};

iface.listen({ name: 'experienceUpdate' }, experienceData => {
  experience.set(experienceData);
});

module.exports = experience;
