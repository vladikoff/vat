/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('../ourscore');

module.exports = (createValidator) => {
  return () => {
    var validator = createValidator();

    return validator.transform((val) => {
      if (! _.isNumber(val)) {
        if (/^\d+$/.test(val)) {
          return parseInt(val, 10);
        } else if (/^\d*\.\d*$/.test(val)) {
          return parseFloat(val);
        }
      }

      return val;
    })
    .test((val) => {
      return _.isNumber(val) || _.isUndefined(val);
    });
  };
};



