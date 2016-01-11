'use strict';

const EventNode = require('../utils/EventNode');
const ChannelDelegate = require('./ChannelDelegate');

class Channel {

  constructor (name, gateway) {
    this.name = name;
    this.gateway = gateway;
    this.listeners = {};
    this.listeners.system = new EventNode();
    this.listeners.user = new EventNode();
    this.responders = new EventNode();
    this.requests = {};
  }

  broadcast (name, payload) {
    const message = {};
    message.name = name;
    message.type = 'broadcast';
    message.channel = this.name;
    message.payload = payload;
    this.gateway.send(message);
  }

  listen (name, callback, system, context) {
    return (system ? this.listeners.system : this.listeners.user).on(name, callback, context);
  }

  request (target, name, payload) {
    const message = {};
    message.name = name;
    message.type = 'request';
    message.channel = this.name;
    message.target = target;
    message.id = Math.random();
    message.payload = payload;
    return new Promise((resolve, reject) => {
      this.requests[message.id] = { resolve: resolve, reject: reject };
      setTimeout(() => this.onRequestTimeout(message.id), 3000);
      this.gateway.send(message);
    });
  }

  onRequestTimeout (id) {
    if (!this.requests[id]) return;
    this.requests[id].reject('The request timed out.');
    delete this.requests[id];
  }

  respond (name, callback, context) {
    return this.responders.on(name, callback, context);
  }

  receive (message) {
    if (typeof message !== 'object') return;
    else if (message.type === 'broadcast') this.receiveBroadcast(message);
    else if (message.type === 'request') this.receiveRequest(message);
    else if (message.type === 'response') this.receiveResponse(message);
  }

  getDelegate (context) {
    return new ChannelDelegate(this, context);
  }

  receiveBroadcast (message) {
    const listeners = message.system ? this.listeners.system : this.listeners.user;
    listeners.trigger(message.name, message.payload, message);
  }

  receiveRequest (message) {
    const promise = this.responders.trigger(message.name, message.payload, message);
    const response = {};
    response.id = message.id;
    response.target = message.source;
    response.name = message.name;
    response.type = 'response';
    response.channel = this.name;
    return promise.then(values => {
      if (values.length === 0) throw new Error('Unhandled');
      response.payload = values[0];
    }).catch(error => {
      response.error = error.message || error;
    }).then(() => this.gateway.send(response));
  }

  receiveResponse (response) {
    if (!this.requests[response.id]) return undefined;
    if (response.error) this.requests[response.id].reject(new Error(response.error));
    else this.requests[response.id].resolve(response.payload);
    delete this.requests[response.id];
   }

}


module.exports = Channel;
