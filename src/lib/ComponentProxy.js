'use strict';

class ComponentProxy {
  
  constructor (component, context) {
    this._component = component;
    this._context = context;
  }

  on (name, callback) {
    this._component.events.on(name, callback, this._context);
  }

  clear () {
    this._component.clear(this._context);
  }

}


module.exports = ComponentProxy;
