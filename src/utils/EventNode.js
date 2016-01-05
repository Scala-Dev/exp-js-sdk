'use strict';

class Listener {

  constructor (callback, context) {
    this.callback = callback;
    this.context = context;
  }

}

class Namespace {

  constructor () {
    this.listeners = [];
  }

  trigger (payload) {
    return Promise.all(this.listeners.map(listener => listener.callback(payload)));
  }

  on (callback, context) {
    const listener = new Listener(callback, context);
    this.listeners.push(listener);
    return () => this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  clear (context) {
    if (!context) this.listeners = [];
    this.listeners = this.listeners.filter(listener => listener.context !== context);
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
    return new Promise((resolve, reject) => {
      if (!this.namespaces[name]) return resolve();
      setTimeout(() => this.namespaces[name].trigger(payload).then(resolve).catch(reject), 0);
    });
  }

  clear (context) {
    Object.keys(this.namespaces).forEach(namespace => namespace.clear(context));
  }

}

module.exports = EventNode;