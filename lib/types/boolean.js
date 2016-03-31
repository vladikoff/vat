/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

module.exports = (vat) => {
  const _ = vat.utils;
  return vat.any().transform((val) => {
    if (val === 'true') {
      return true;
    } if (val === 'false') {
      return false;
    }

    return val;
  })
  .test((val) => {
    return _.isBoolean(val) || _.isUndefined(val);
  });
};

