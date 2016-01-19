'use strict';

const EventNode = require('./EventNode');

class Channel {

  constructor (name, sdk) {
    this.name = name;
    this.sdk = sdk;
    this.listeners = new EventNode();
    this.responders = new EventNode();
    this.requests = {};
  }

  broadcast (name, payload, options) {
    const message = { name: name, channel: this.name };
    if (payload) message.payload = payload;
    if (options.targetConsumerAppUuid) message.targetConsumerAppUuid = options.targetConsumerAppUuid;
    return this.sdk.api.post('/api/networks/current/broadcasts', null, message);
  }

  listen (name, callback, options) {
    return this.listeners.on(name, (payload, message) => {
      if (options.system && !message.system) return;
      if (message.sourceConsumerAppUuid && options.sourceConsumerAppUuid !== message.sourceConsumerAppUuid) return;
      return options.callback(payload, message);
    }, options.context);
  }

  request (target, name, payload, options) {
    const message = { target: target, channel: this.name, name: name };
    if (payload) message.payload = payload;
    if (options.targetConsumerAppUuid) message.targetConsumerAppUuid = options.targetConsumerAppUuid;
    message.id = Math.random();
    return new Promise((resolve, reject) => {
      this.requests[message.id] = { resolve: resolve, reject: reject };
      setTimeout(() => this.onRequestTimeout(message.id), 3000);
      return this.sdk.api.post('/api/networks/current/requests', null, message);
    });
  }

  onRequestTimeout (id) {
    if (!this.requests[id]) return;
    this.requests[id].reject(new Error('The request timed out.'));
    delete this.requests[id];
  }

  respond (name, callback, options) {
    return this.responders.on(options.name, (payload, message) => {
      if (options.system && !message.system) return null;
      if (message.sourceConsumerAppUuid && options.sourceConsumerAppUuid !== message.sourceConsumerAppUuid) return null;
      return callback(payload, message);
    }, options.context);
  }

  receive (message) {
    if (message.type === 'broadcast') return this.receiveBroadcast(message);
    else if (message.type === 'request') return this.receiveRequest(message);
    else if (message.type === 'response') return this.receiveResponse(message);
  }

  receiveBroadcast (message) {
    return this.listeners.trigger(message.name, message.payload, message);
  }

  receiveRequest (request) {
    const promise = this.responders.trigger(request.name, request.payload, request);
    const response = {
      target: request.source,
      id: request.id,
      channel: this.name
    };
    return promise.then(values => {
      const value = values.find(value => !!value);
      if (!value) throw new Error('Unhandled');
      response.payload = value;
    }).catch(error => {
      response.error = error.message || error;
    }).then(() => {
      this.sdk.api.post('/api/networks/current/responses', null, response);
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