'use strict';

const Namespace = require('./ListenerNamespace');

class EventNode {

  constructor () {
    this._namespaces = {};
  }

  _getNamespace (name) {
    if (!this._namespaces[name]) {
      this._namespaces[name] = new Namespace();
    }
    return this._namespaces[name];
  }

  on (name, callback, thisArg) {
    if (thisArg) callback.bind(thisArg);
    return this._getNamespace(name).on(callback);
  }

  trigger () {
    return this._getNamespace(arguments[0]).trigger(arguments.slice(1));
  }

  get hasListeners () {
    return this._namespaces.some(namespace => namespace.hasListeners);
  }

  clear () {
    this._namespaces = {};
  }

}


module.exports = EventNode;
