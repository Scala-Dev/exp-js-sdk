'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Resource = require('./Resource');

module.exports = (function (_Resource) {
  _inherits(Experience, _Resource);

  function Experience(document, options) {
    _classCallCheck(this, Experience);

    _get(Object.getPrototypeOf(Experience.prototype), 'constructor', this).call(this, document, options);
    this.document.apps = this.document.apps || [];
    this.document.dayPlans = this.document.dayPlans || [];
    this.document.schedules = this.document.schedules || [];
    this.document.groups = this.document.groups || [];
  }

  _createClass(Experience, [{
    key: 'apps',
    get: function get() {
      return this.document.apps;
    },
    set: function set(apps) {
      this.document.apps = apps;
    }
  }, {
    key: 'dayPlans',
    get: function get() {
      return this.document.dayPlans;
    },
    set: function set(dayPlans) {
      this.document.dayPlans = dayPlans;
    }
  }, {
    key: 'schedules',
    get: function get() {
      return this.document.schedules;
    },
    set: function set(schedules) {
      this.document.schedules = schedules;
    }
  }, {
    key: 'groups',
    get: function get() {
      return this.document.groups;
    },
    set: function set(groups) {
      this.document.groups = groups;
    }
  }]);

  return Experience;
})(Resource);