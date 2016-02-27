/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

module.exports = (createValidator) => {
  return () => {
    var validator = createValidator();

    validator.transform((val) => {
      let actualType = Object.prototype.toString.call(val);
      if (actualType !== '[object Number]') {
        if (/^\d+$/.test(val)) {
          return parseInt(val, 10);
        } else if (/^\d*\.\d*$/.test(val)) {
          return parseFloat(val);
        }
      }

      return val;
    })
    .use((val) => {
      let actualType = Object.prototype.toString.call(val);
      return actualType === '[object Number]';
    });

    return validator;
  };
};



