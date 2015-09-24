'use strict';

require('isomorphic-fetch');
var credentials = require('./credentials');

var models = require('./models');
var channels = require('./channels');
var config = require('./config');

var fetch_ = function fetch_(path, options) {
  var url = config.host + path;
  options.headers = options.headers || {};
  return Promise.resolve().then(function () {
    return credentials.generateToken();
  }).then(function (token) {
    options.headers.Authorization = 'Bearer ' + token;
    return fetch(url, options);
  }).then(function (response) {
    return response.json();
  })['catch'](function (error) {
    throw new Error(error);
  });
};

var createQueryString = function createQueryString(obj) {
  var parts = ['?'];
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      parts.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
  }
  return parts.join('&');
};

var get = function get(path, params) {
  if (params) path += createQueryString(params);
  return fetch_(path, { method: 'get' });
};

var getCurrentDevice = function getCurrentDevice() {
  return Promise.resolve().then(function () {
    return channels.system.request({ name: 'getCurrentDevice' });
  }).then(function (device) {
    return new models.Device({ device: device, current: true });
  });
};

var getCurrentExperience = function getCurrentExperience() {
  return Promise.resolve().then(function () {
    return channels.system.request({ name: 'getCurrentExperience' });
  }).then(function (experience) {
    return new models.Experience({ experience: experience });
  });
};

var getDevice = function getDevice(uuid) {
  return Promise.resolve().then(function () {
    if (!uuid) throw new Error('uuidRequired');
    return get('/api/devices/' + uuid);
  }).then(function (device) {
    return new models.Device({ device: device });
  });
};

var getDevices = function getDevices(params) {
  return Promise.resolve().then(function () {
    return get('/api/devices', params);
  }).then(function (query) {
    var devices = [];
    query.results.forEach(function (device) {
      devices.push(new models.Device({ device: device }));
    });
    return devices;
  });
};

var getExperience = function getExperience(uuid) {
  return Promise.resolve().then(function () {
    if (!uuid) throw new Error('uuidRequired');
    return get('/api/experiences/' + uuid);
  }).then(function (experience) {
    return new models.Experience({ experience: experience });
  });
};

var getExperiences = function getExperiences(params) {
  return Promise.resolve().then(function () {
    return get('/api/experiences', params);
  }).then(function (query) {
    var experiences = [];
    query.results.forEach(function (experience) {
      experiences.push(new models.Experience({ experience: experience }));
    });
    return experiences;
  });
};

var getLocation = function getLocation(uuid) {
  return Promise.resolve().then(function () {
    if (!uuid) throw new Error('uuidRequired');
    return get('/api/locations/' + uuid);
  }).then(function (location) {
    return new models.Location({ location: location });
  });
};

var getLocations = function getLocations(params) {
  return Promise.resolve().then(function () {
    return get('/api/locations', params);
  }).then(function (query) {
    var locations = [];
    query.results.forEach(function (location) {
      locations.push(new models.Location({ location: location }));
    });
    return locations;
  });
};

var getZone = function getZone(uuid) {
  return Promise.resolve().then(function () {
    if (!uuid) throw new Error('uuidRequired');
    return get('/api/zones/' + uuid);
  }).then(function (zone) {
    return new models.Zone({ zone: zone });
  });
};

var getZones = function getZones(params) {
  return Promise.resolve().then(function () {
    return get('/api/zones', params);
  }).then(function (query) {
    var zones = [];
    query.results.forEach(function (zone) {
      zones.push(new models.Zone({ zone: zone }));
    });
    return zones;
  });
};

var identifyDevice = function identifyDevice(deviceUuid) {
  return channels.system.request({ name: 'identify' }, { deviceUuid: deviceUuid });
};

var getContentNode = function getContentNode(uuid) {
  return Promise.resolve().then(function () {
    if (!uuid) throw new Error('uuidRequired');
    return get('/api/content/' + uuid + '/children');
  }).then(function (content) {
    return new models.Content({ content: content });
  });
};

var getContentNodes = function getContentNodes(params) {
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