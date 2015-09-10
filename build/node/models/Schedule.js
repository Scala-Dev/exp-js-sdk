'use strict';

var RRule = require('rrule').RRule;

module.exports = function (document, experience) {

  this.document = document;

  // Generate list of rrule objects in priority order.
  var recurrences = document.recurrences.map(function (recurrence) {
    return {
      rrule: RRule.fromString(recurrence.rrule),
      dayPlanKey: recurrence.dayPlanKey
    };
  }).reverse();

  // Returns dayplan object for LOCAL TIME.
  this.getDayPlan = function (date) {

    // Use current time by default.
    if (!date) date = new Date();

    // Get start and end given day in UTC.
    var offset = date.getTimezoneOffset() * 60 * 1000;
    date = new Date(date.getTime() - offset);
    var startDate = new Date(date.getTime());
    var endDate = new Date(date.getTime());
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    // Find the first recurrence that occurs on the given day.
    var recurrence = recurrences.find(function (recurrence) {
      return recurrence.rrule.between(startDate, endDate).length > 0;
    });

    if (!recurrence) return Promise.reject(new Error('No dayplan for given date.'));
    return experience.getDayPlan(recurrence.dayPlanKey);
  };
};