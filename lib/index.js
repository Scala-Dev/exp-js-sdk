'use strict';

const Runtime = require('./components/Runtime');
const Api = require('./components/Api');
const Network = require('./components/Network');
const EventNode = require('./utils/EventNode');

const exp = {
  runtime: Runtime.getDelegate(),
  api: Api.getDelegate(),
  network: Network.getDelegate(),
  utils: {
    components: {
      Runtime: Runtime,
      Api: Api,
      Network: Network
    },
    EventNode: EventNode
  }
};

if (typeof window === 'object') window.exp = exp;

module.exports = exp;
