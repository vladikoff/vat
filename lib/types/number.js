/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

function toRangeError(value) {
  let err = new RangeError('invalid value');
  err.value = value;
  return err;
}

const number = {
  /**
   * Specifies the maximum acceptable value
   *
   * @method max
   * @param {number} limit
   */
  max(limit) {
    return this.test((val) => {
      if (val > limit) {
        throw toRangeError(val);
      }
      return true;
    });
  },

  /**
   * Specifies the minimum acceptable value
   *
   * @method min
   * @param {number} limit
   */
  min(limit) {
    return this.test((val) => {
      if (val < limit) {
        throw toRangeError(val);
      }
      return true;
    });
  }
};


module.exports = (vat) => {
  const _ = vat.utils;
  return vat.any().clone().extend(number).transform((val) => {
    if (! _.isNumber(val)) {
      if (/^[+-]?\d+$/.test(val)) {
        return parseInt(val, 10);
      } else if (/^[+-]?\d*\.\d*$/.test(val)) {
        return parseFloat(val);
      } else if (/^[+-]?Infinity$/.test(val)) {
        if (val[0] === '-') {
          return -Infinity;
        }

        return Infinity;
      }
    }

    return val;
  })
  .test((val) => {
    return _.isNumber(val) || _.isUndefined(val);
  });
};
