'use strict';

class Listener {

  constructor (namespace, callback, thisArg) {
    this._namespace = namespace;
    this._callback = callback;
    this._thisArg = thisArg;
  }

  trigger (args) {
    return this._callback.apply(this._thisArg, args);
  }

  cancel () {
    return this._namespace.cancel(this);
  }

}

class Namespace {

  constructor () {
    this._listeners = [];
  }

  trigger (args) {
    return Promise.all(this._listeners.map(listener => listener.trigger(args)));
  }

  on (callback, thisArg) {
    const listener = new Listener(this, callback, thisArg);
    this._listeners.push(listener);
    return listener;
  }

  get hasListeners () {
    return this._listeners.length > 0;
  }

  cancel (listener) {
    this._listeners.splice(this._listeners.indexOf(listener), 1);
  }
}

module.exports = Namespace;
