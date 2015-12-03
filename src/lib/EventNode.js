'use strict';

const _ = require('lodash');

let defaultContext = {};

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
    this.listeners.map(listener => listener.trigger(payload));
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
    _.forOwn(this.contexts, context => context.trigger(payload));
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
    context = context || defaultContext;
    if (!this.namespaces[name]) this.namespaces[name] = new Namespace();
    return this.namespaces[name].on(callback, context);
  }

  trigger (name, payload) {
    let namespace = this.namespaces[name];
    if (!namespace) return;
    namespace.trigger(payload);
  }

  clear (context) {
    _.forOwn(this.namespaces, namespace => namespace.clear(context));
  }

}

module.exports = EventNode;
