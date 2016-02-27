/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

module.exports = (createValidator) => {
  return () => {
    let validator = createValidator();

    validator.use((val) => {
      let actualType = Object.prototype.toString.call(val);
      return actualType === '[object String]';
    });

    return validator;
  };
};
