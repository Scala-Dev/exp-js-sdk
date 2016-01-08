'use strict';

const EventNode = require('../utils/EventNode');
const ChannelDelegate = require('./ChannelDelegate');

class Channel {

  constructor (name, gateway) {
    this.name = name;
    this.gateway = gateway;
    this.system = {};
    this.system.listeners = new EventNode();
    this.system.responders = new EventNode();
    this.system.requests = {};
    this.user = {};
    this.user.listeners = new EventNode();
    this.user.responders = new EventNode();
    this.user.requests = {};
  }

  broadcast (name, payload, system) {
    const message = {};
    message.name = name;
    message.type = 'broadcast';
    message.channel = this.name;
    if (system) message.system = true;
    if (payload) message.payload = payload;
    this.gateway.send(message);
  }

  listen (name, callback, system, context) {
    return (system ? this.system.listeners : this.user.listeners).on(name, callback, context);
  }

  request (target, name, payload, system) {
    const message = {};
    message.name = name;
    message.type = 'request';
    message.channel = this.name;
    message.target = target;
    message.id = Math.random();
    if (payload) message.payload = payload;
    if (system) message.system = true;
    const request_ = {};
    setTimeout(() => this.onRequestTimeout(system, message.id), 3000);
    (system ? this.system.requests : this.user.requests)[message.id] = request_;
    this.gateway.send(message);
    return new Promise((a, b) => { request_.resolve = a; request_.reject = b; });
  }

  onRequestTimeout (system, id) {
    const requests = (system ? this.system.requests : this.user.requests);
    if (!requests[id]) return;
    requests[id].reject('The request timed out.');
    delete requests[id];
  }

  respond (name, callback, system, context) {
    return (system ? this.system.responders : this.user.responders).on(name, callback, context);
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
    console.log(message.name);
    console.log(message.channel);
    (message.system ? this.system.listeners : this.user.listeners).trigger(message.name, message.payload, message);
  }

  receiveRequest (request) {
    let promise;
    if (request.system) promise = this._systemResponders.trigger(request.name, request);
    else promise = this._userResponders.trigger(request.name, request);
    const response = {};
    response.id = request.id;
    response.target = request.source;
    response.name = request.name;
    response.type = 'response';
    return promise.then(values => {
      if (values.length === 0) throw new Error('Unhandled');
      response.payload = values[0];
    }).catch(error => {
      response.error = error.message || error;
    }).then(() => this._send(response));
  }

  receiveResponse (response) {
    if (!this._requests[response.id]) return undefined;
    if (response.error) this._requests[response.id].reject(new Error(response.error));
    else this._requests[response.id].resolve(response.payload);
    delete this._requests[response.id];
   }

}


module.exports = Channel;
