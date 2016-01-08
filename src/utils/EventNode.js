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

  trigger (args) {
    return Promise.all(this.listeners.map(listener => listener.callback.apply(null, args)));
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

const nodes = {};

class EventNode {

  constructor () {
    this.id = Math.random();
    this.namespaces = {};
  }

  static clear (context) {
    Object.keys(nodes).forEach(id => nodes[id].clear(context));
  }

  on (name, callback, context) {
    if (!nodes[this.id]) nodes[this.id] = this;
    if (!this.namespaces[name]) this.namespaces[name] = new Namespace();
    return this.namespaces[name].on(callback, context || Math.random());
  }

  trigger () {
    return new Promise((resolve, reject) => {
      if (!this.namespaces[arguments[0]]) return resolve();
      setTimeout(() => this.namespaces[arguments[0]].trigger([].splice.call(arguments, 1)).then(resolve).catch(reject), 0);
    });
  }

  clear (context) {
    Object.keys(this.namespaces).forEach(name => {
      this.namespaces[name].clear(context);
      if (this.namespaces[name].listeners.length === 0) delete this.namespaces[name];
    });
    if (Object.keys(this.namespaces).length === 0) delete nodes[this.id];
  }

}

module.exports = EventNode;