'use strict';

require('isomorphic-fetch');
const credentials = require('./credentials');

const models = require('./models');
const channels = require('./channels');
const config = require('./config');

const fetch_ = (path, options) => {
  const url = config.host + path;
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



const getCurrentDevice = () => {
  return Promise.resolve()
    .then(() => {
      return channels.system.request({ name: 'getCurrentDevice' });
    })
    .then(device => {
      return new models.Device({ device: device, current: true });
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


const getDevice = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/devices/' + uuid);
    })
    .then(device => {
      return new models.Device({ device: device });
    });
};

const getDevices = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/devices', params);
    })
    .then(query => {
      const devices = [];
      query.results.forEach(device => {
        devices.push(new models.Device({ device: device }));
      });
      return devices;
    });
};

const getExperience = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/experiences/' + uuid);
    })
    .then(experience => {
      return new models.Experience({ experience: experience });
    });
};

const getExperiences = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/experiences', params);
    })
    .then(query => {
      const experiences = [];
      query.results.forEach(experience => {
        experiences.push(new models.Experience({ experience: experience }));
      });
      return experiences;
    });
};


const getLocation = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/locations/' + uuid);
    })
    .then(location => {
      return new models.Location({ location: location });
    });
};

const getLocations = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/locations', params);
    })
    .then(query => {
      const locations = [];
      query.results.forEach(location => {
        locations.push(new models.Location({ location: location }));
      });
      return locations;
    });
};


const getZone = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/zones/' + uuid);
    })
    .then(zone => {
      return new models.Zone({ zone: zone });
    });
};

const getZones = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/zones', params);
    })
    .then(query => {
      const zones = [];
      query.results.forEach(zone => {
        zones.push(new models.Zone({ zone: zone }));
      });
      return zones;
    });
};

const identifyDevice = deviceUuid => {
  return channels.system.request({ name: 'identify' }, { deviceUuid: deviceUuid });
};

const getContentNode = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/content/' + uuid + '/children');
    })
    .then(content => {
      return new models.ContentNode({ content: content });
    });
};

const getContentNodes = params => {
  return Promise.reject();
};

module.exports.identifyDevice = identifyDevice;

module.exports.getContentNode = getContentNode;

module.exports.getCurrentDevice = getCurrentDevice;
module.exports.getCurrentExperience = getCurrentExperience;

module.exports.getExperience = getExperience;
module.exports.getExperiences = getExperiences;

module.exports.getDevice = getDevice;
module.exports.getDevices = getDevices;

module.exports.getLocation = getLocation;
module.exports.getLocations = getLocations;

module.exports.getZone = getZone;
module.exports.getZones = getZones;

module.exports.get = get;
module.exports.fetch = fetch_;
