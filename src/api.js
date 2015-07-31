'use strict';

require('isomorphic-fetch');
const credentials = require('./credentials');

const base = 'http://localhost:9000';
const models = require('./models');
const channels = require('./channels');

const createQueryString = obj => {
  var parts = ['?'];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
  }
  return parts.join('&');
};

const get = (path, params) => {
  if (params) path += createQueryString(params);
  return fetch_(path, { method: 'get' });
};


/**
 * Make a remote request
 * @name fetch
 * @memberOf scala.api
 * @method
 * @param {string} path The api path, i.e., /api/devices
 * @param {object} options Fetch compatible options.
 * @returns {Promise} A promise that will resolve with a javascript object.
 */
const fetch_ = (path, options) => {
  const url = base + path;
  options.headers = options.headers || {};
  return Promise.resolve()
    .then(() => credentials.getToken())
    .then(token => {
      options.headers.Authorization = 'Bearer ' + token;
      return fetch(url, options);
    })
    .then(response => {
      return response.json();
    })
    .catch(error => {
      throw new Error(error);
    });
  
};

const getCurrentDevice = () => {

  return Promise.resolve()
    .then(() => {
      return channels.system.request({ name: 'getCurrentDevice' });
    })
    .then(device => {
      return new models.Device({ device: device, current: true });
    });
};

const getDevice = options => {
  return Promise.resolve()
    .then(() => {
      if (!options.uuid) throw new Error('uuidRequired');
      return get('/api/devices/' + options.uuid);
    })
    .then(device => {
      return new models.Device({ device: device });
    });
};

const getDevices = options => {
  options = options || {};
  return Promise.resolve()
    .then(() => {
      return get('/api/devices', options.params);
    })
    .then(query => {
      const devices = [];
      query.results.forEach(device => {
        devices.push(new models.Device({ device: device }));
      });
      return devices;
    });
};

const getCurrentExperience = () => {
  return Promise.resolve()
    .then(() => {
      return channels.system.request({ name: 'getCurrentExperience' });
    })
    .then(experience => {
      return new models.Experience({ experience: experience });
    });
};

const getExperience = options => {
  return Promise.resolve()
    .then(() => {
      if (!options.uuid) throw new Error('uuidRequired');
      return get('/api/experiences/' + options.uuid);
    })
    .then(experience => {
      return new models.Experience({ experience: experience });
    });
};

const getExperiences = options => {
  options = options || {};
  return Promise.resolve()
    .then(() => {
      return get('/api/experiences', options.params);
    })
    .then(query => {
      const experiences = [];
      query.results.forEach(experience => {
        experiences.push(new models.Experience({ experience: experience }));
      });
      return experiences;
    });
};




module.exports.getDevices = getDevices;
module.exports.getDevice = getDevice;
module.exports.getCurrentDevice = getCurrentDevice;

module.exports.getCurrentExperience = getCurrentExperience;
module.exports.getExperiences = getExperiences;
module.exports.getExperience = getExperience;
