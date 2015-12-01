'use strict';

const Channel = require('../lib/Channel');

module.exports = class Network {

  constructor (context) {
    this.context = context;
  }

  getChannel (name, network) {
    return new Channel(name, network, this.context);
  }

};
