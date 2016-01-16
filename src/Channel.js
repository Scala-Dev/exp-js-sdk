'use strict';

const EventNode = require('./EventNode');

const api = require('./api');

class Delegate {

  constructor (channel, context) {
    this.channel = channel;
    this.context = context;
  }

  broadcast (name, payload) {
    this.channel.broadcast(name, payload);
  }

  listen (name, options, callback) {
    return this.channel.listen(name, options, callback, this.context);
  }

  request (target, name, payload) {
    return this.channel.request(target, name, payload);
  }

  respond (name, options, callback) {
    return this.channel.respond(name, options, callback, this.context);
  }

}

class Channel {

  constructor (name) {
    this.name = name;
    this.listeners = new EventNode();
    this.responders = new EventNode();
    this.requests = {};
  }

  getDelegate (context) {
    return new Delegate(this, context);
  }

  broadcast (name, payload) {
    return api.post('/api/network/broadcast', null, { name: name, payload: payload, channel: this.name });
  }

  listen (name, options, callback, context) {
    if (!callback) { callback = options; options = {}; }
    options = options || {};
    return this.listeners.on(name, (payload, message) => {
      if (options.system && !message.system) return;
      callback(payload, message);
    }, context);
  }

  request (target, name, payload) {
    const message = {};
    message.name = name;
    message.channel = this.name;
    message.target = target;
    message.id = Math.random();
    message.payload = payload;
    return new Promise((resolve, reject) => {
      this.requests[message.id] = { resolve: resolve, reject: reject };
      setTimeout(() => this.onRequestTimeout(message.id), 3000);
      api.post('/api/network/request', null, message);
    });
  }

  onRequestTimeout (id) {
    if (!this.requests[id]) return;
    this.requests[id].reject('The request timed out.');
    delete this.requests[id];
  }

  respond (name, options, callback, context) {
    if (!callback) { callback = options; options = {}; }
    options = options || {};
    return this.responders.on(name, callback, context);
  }

  receive (message) {
    if (typeof message !== 'object') return;
    else if (message.type === 'broadcast') this.receiveBroadcast(message);
    else if (message.type === 'request') this.receiveRequest(message);
    else if (message.type === 'response') this.receiveResponse(message);
  }

  receiveBroadcast (message) {
    this.listeners.trigger(message.name, message.payload, message);
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
    }).then(() => {
      api.post('/api/network/response', null, response);
    });
  }

  receiveResponse (response) {
    if (!this.requests[response.id]) return undefined;
    if (response.error) this.requests[response.id].reject(new Error(response.error));
    else this.requests[response.id].resolve(response.payload);
    delete this.requests[response.id];
   }

}


module.exports = Channel;
