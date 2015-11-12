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
    return credentials.getToken();
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

var post = function post(path, params, body) {
  var options = {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  };
  if (body) options.body = body;
  if (params) path += createQueryString(params);
  return fetch_(path, options);
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
    return { total: query.total, results: devices };
  });
};

var getThing = function getThing(uuid) {
  return Promise.resolve().then(function () {
    if (!uuid) throw new Error('uuidRequired');
    return get('/api/things/' + uuid);
  }).then(function (thing) {
    return new models.Device({ thing: thing });
  });
};

var findThings = function findThings(params) {
  return Promise.resolve().then(function () {
    return get('/api/things', params);
  }).then(function (query) {
    var things = [];
    query.results.forEach(function (thing) {
      things.push(new models.Thing({ thing: thing }));
    });
    return { total: query.total, results: things };
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
    return { total: query.total, results: experiences };
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
    return { total: query.total, results: locations };
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
    return new models.ContentNode({ content: content });
  });
};

var getData = function getData(key, group) {
  return Promise.resolve().then(function () {
    return get('/api/data/' + encodeURIComponent(group) + '/' + encodeURIComponent(key));
  }).then(function (data) {
    return new models.Data({ data: data });
  });
};

var findData = function findData(params) {
  return Promise.resolve().then(function () {
    return get('/api/data', params);
  }).then(function (query) {
    var results = [];
    query.results.forEach(function (data) {
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
module.exports.post = post;

module.exports.fetch = fetch_;