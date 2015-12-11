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
    .then(document => {
      return new models.Experience(document);
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
      return { total: query.total, results: devices };
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

const findContentNodes = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/content', params);
    })
    .then(query => {
      const contentNodes = [];
      query.results.forEach(content => {
        contentNodes.push(new models.ContentNode({ content: content }));
      });
      return { total: query.total, results: contentNodes };
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

const getFeed = uuid => {
  return Promise.resolve()
    .then(() => {
      if (!uuid) throw new Error('uuidRequired');
      return get('/api/connectors/feeds/' + uuid);
    })
    .then(feed => {
      return new models.Feed({ feed: feed });
    });
};

const findFeeds = params => {
  return Promise.resolve()
    .then(() => {
      return get('/api/connectors/feeds', params);
    })
    .then(query => {
      const feeds = [];
      query.results.forEach(feed => {
        feeds.push(new models.Feed({ feed: feed }));
      });
      return { total: query.total, results: feeds };
    });
};

module.exports.identifyDevice = identifyDevice;

module.exports.getContentNode = getContentNode;
module.exports.getContent = getContentNode;
module.exports.findContentNodes = findContentNodes;
module.exports.findContent = findContentNodes;

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

module.exports.getFeed = getFeed;
module.exports.findFeeds = findFeeds;

module.exports.get = get;
module.exports.fetch = fetch_;
