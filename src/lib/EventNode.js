'use strict';

const _ = require('lodash');

let defaultContext = {};

class EventNode {

  constructor () {
    this.namespaces = {};
  }

  on (name, callback, context) {
    context = context || defaultContext;
    if (!this.namespaces[name]) this.namespaces[name] = new Namespace();
    return this.namespaces[name].on(callback, context);
  }

  trigger () {
    let namespace = this.namespaces[arguments[0]];
    if (!namespace) return;
    namespace.trigger.apply(namespace, aguments.slice(1));
  }


  clear (context) {
    _.forOwn(this.namespaces, namespace => namespace.clear(context));
  }

}

class Namespace {

  constructor () {
    this.contexts = {};
  }

  trigger () {
    const arguments_ = arguments;
    _.forOwn(this.contexts, context => context.trigger.apply(context, arguments_));
  }

  on (callback, context) {
    if (!this.contexts[context]) this.contexts[context] = new Context();
    return this.context[context].on(callback);
  }

  clear (context) {
    delete this.contexts[context];
  }

}


class Context {

  constructor () {
    this.listeners = [];
  }

  trigger () {
    const arguments_ = arguments;
    this.listeners.map(listener => listener.trigger.apply(listener, arguments_));
  }

  on (callback) {
    const listener = new Listener(this, callback);
    this.listeners.push(listener);
    return listener;
  }

}


class Listener {

  constructor (context, callback) {
    this.context = context;
    this.callback = callback;
  }

  trigger () {
    return this.callback.apply(null, arguments);
  }

  cancel () {
    this.context.listeners.splice(this.context.listeners.indexOf(this), 1);
  }

}


module.exports = EventNode;
