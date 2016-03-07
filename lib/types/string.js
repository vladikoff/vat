/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('../ourscore');

const string = {
  /**
   * Specifies the exact string length required
   *
   * @method len
   * @param {number} limit
   */
  len(limit) {
    this.test((val) => {
      return val.length === limit;
    });

    return this;
  },

  /**
   * Specifies the maximum number of characters
   *
   * @method max
   * @param {number} limit
   */
  max(limit) {
    this.test((val) => {
      return val.length <= limit;
    });

    return this;
  },

  /**
   * Specifies the minimum number of characters
   *
   * @method min
   * @param {number} limit
   */
  min(limit) {
    this.test((val) => {
      return val.length >= limit;
    });

    return this;
  }
};

module.exports = (createValidator) => {
  return () => {
    let validator = createValidator();

    validator.transform((val) => {
      // trim strings by default
      if (_.isString(val)) {
        return val.trim();
      }

      return val;
    }).test((val) => {
      return _.isString(val) || _.isUndefined(val);
    });

    _.extend(validator, string);

    return validator;
  };
};
