/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global module */

'use strict'; //jshint ignore:line

module.exports = {
  contains(array, item) {
    return array.indexOf(item) !== -1;
  },

  extend(target/*, ...src*/) {
    const sources = [].slice.call(arguments, 1);
    sources.forEach((source) => {
      for (let key in source) {
        target[key] = source[key];
      }
    });
    return target;
  },

  isBoolean(val) {
    return Object.prototype.toString.call(val) === '[object Boolean]';
  },

  isFunction(val) {
    return typeof val === 'function';
  },

  isNumber(val) {
    return Object.prototype.toString.call(val) === '[object Number]';
  },

  isString(val) {
    return Object.prototype.toString.call(val) === '[object String]';
  },

  isUndefined(val) {
    return typeof val === 'undefined';
  },

  union(/*...arrays*/) {
    let arrays = [].slice.call(arguments, 0);

    let union = [];
    arrays.forEach((array) => {
      array.forEach((item) => {
        if (! module.exports.contains(union, item)) {
          union.push(item);
        }
      });
    });

    return union;
  }
};
