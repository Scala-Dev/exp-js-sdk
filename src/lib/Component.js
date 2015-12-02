'use strict';

const Interface = require('../lib/Interface');

const map = {};

class Base extends Interface {

  constructor (context) {
    if (!map[this.constructor.name]) {
      map[this.constructor.name] = [];
    }
    map[this.constructor.name].push(this);
    this._context = context;
    super();
  }

  static getAll () {
    return map[this.name];
  }

  clear () {
    const list = map[this.constructor.name];
    list.splice(list.indexOf(this), 1);
    super.clear();
  }

}

module.exports = Base;
