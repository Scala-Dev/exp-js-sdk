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
      if (!response.ok) {
        // Why is this not the way fetch works?
        return Promise.reject(response);
      }
      return response.json();
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


const getDevice = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/devices/' + uuid);
    })
    .then(document => {
      console.log('HERE IS DEVICE');
      console.log(document);
      return new models.Device(document);
    });
};

const getDevices = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/devices', params);
    })
    .then(query => {
      const devices = [];
      query.results.forEach(document => {
        devices.push(new models.Device(document));
      });
      return { total: query.total, results: devices };
    });
};

const getCurrentDevice = () => {
  return Promise.resolve()
    .then(() => {
      return getDevice(config.deviceUuid);
    });
};


const getThing = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/things/' + uuid);
    })
    .then(thing => {
      return new models.Device({ thing: thing });
    });
};

const findThings = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/things', params);
    })
    .then(query => {
      const things = [];
      query.results.forEach(thing => {
        things.push(new models.Thing({ thing: thing }));
      });
      return { total: query.total, results: things };
    });
};


const getExperience = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/experiences/' + uuid);
    })
    .then(document => {
      console.log('HERE IS EXPERIENCE');
      console.log(document);
      return new models.Experience(document);
    });
};

const getExperiences = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/experiences', params);
    })
    .then(query => {
      const experiences = [];
      query.results.forEach(document => {
        experiences.push(new models.Experience(document));
      });
      return { total: query.total, results: experiences };
    });
};

const getCurrentExperience = () => {
  return Promise.resolve()
    .then(() => {
      return getCurrentDevice();
    })
    .then(device => {
      console.log('TEST');
      console.log(device);
      if (!device.experience || !device.experience.uuid) {
        return Promise.reject('This device has no experience.');
      }
      return getExperience(device.experience.uuid);
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
      return { total: query.total, results: locations };
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


const getData = (key, group) => {
  return Promise.resolve()
    .then(() => {
      return get('/api/data/' + encodeURIComponent(group) + '/' + encodeURIComponent(key));
    })
    .then(data => {
      return new models.Data({ data: data });
    });
};

const findData = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/data', params);
    })
    .then(query => {
      const results = [];
      query.results.forEach(data => {
        results.push(new models.Data({ data: data }));
      });
      return { total: query.total, results: results };
    });
};

module.exports.identifyDevice = identifyDevice;

module.exports.getContentNode = getContentNode;
module.exports.getContent = getContentNode;

module.exports.getCurrentDevice = getCurrentDevice;
module.exports.getCurrentExperience = getCurrentExperience;

module.exports.getExperience = getExperience;
module.exports.getExperiences = getExperiences;
module.exports.findExperiences = getExperiences;

module.exports.getDevice = getDevice;
module.exports.getDevices = getDevices;
module.exports.findDevices = getDevices;

module.exports.getLocation = getLocation;
module.exports.getLocations = getLocations;
module.exports.findLocations = getLocations;

module.exports.getThing = getThing;
module.exports.findThings = findThings;

module.exports.getData = getData;
module.exports.findData = findData;

module.exports.get = get;
module.exports.fetch = fetch_;
