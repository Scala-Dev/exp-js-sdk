'use strict';

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const query = { uuid: 'test-consumer-app' };
const doc = { uuid: 'test-consumer-app', apiKey: 'test-api-key', org: process.env.EXP_TEST_ORGANIZATION };

module.exports = () => {
  return MongoClient.connect('mongodb://localhost:27017/data-store').then(database => {
    return database.collection('consumerapps').update(query, doc, { upsert: true }).then(() => {
      database.close();
    });
  });
};
