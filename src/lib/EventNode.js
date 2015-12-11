'use strict';

const _ = require('lodash');


class Listener {

  constructor (context, callback) {
    this.context = context;
    this.callback = callback;
  }

  trigger (payload) {
    return this.callback(payload);
  }

  cancel () {
    this.context.listeners.splice(this.context.listeners.indexOf(this), 1);
  }

}


class Context {

  constructor () {
    this.listeners = [];
  }

  trigger (payload) {
    return Promise.all(this.listeners.map(listener => listener.trigger(payload)));
  }

  on (callback) {
    const listener = new Listener(this, callback);
    this.listeners.push(listener);
    return listener;
  }

}


class Namespace {

  constructor () {
    this.contexts = {};
  }

  trigger (payload) {
    const promises = [];
    _.forOwn(this.contexts, context => promises.push(context.trigger(payload)));
    return Promise.all(promises);
  }

  on (callback, context) {
    if (!this.contexts[context]) this.contexts[context] = new Context();
    return this.contexts[context].on(callback);
  }

  clear (context) {
    delete this.contexts[context];
  }

}


class EventNode {

  constructor () {
    this.namespaces = {};
  }

  on (name, callback, context) {
    if (!this.namespaces[name]) this.namespaces[name] = new Namespace();
    return this.namespaces[name].on(callback, context);
  }

  trigger (name, payload) {
    if (!this.namespaces[name]) return Promise.resolve();
    return this.namespaces[name].trigger(payload);
  }

  clear (context) {
    _.forOwn(this.namespaces, namespace => namespace.clear(context));
  }

}

module.exports = EventNode;
