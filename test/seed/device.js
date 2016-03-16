'use strict';

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const query = { uuid: 'test-device' };
const doc = { uuid: 'test-device', secret: 'test-secret', org: process.env.EXP_TEST_ORGANIZATION, name: 'test-device', subtype: 'scala:device:server' };

module.exports = () => {
  return MongoClient.connect('mongodb://localhost:27017/data-store').then(database => {
    return database.collection('device').update(query, doc, { upsert: true }).then(() => {
      database.close();
    });
  });
};
