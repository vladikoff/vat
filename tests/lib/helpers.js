/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, exports */

'use strict'; //jshint ignore:line

const assert = require('chai').assert;

exports.expectSuccess = function (func, val, expected) {
  if (arguments.length === 2) {
    expected = val;
  }

  let result = func(val);

  assert.strictEqual(result, expected);

  return result;
};

exports.expectTypeError = function (func, val) {
  let err;
  try {
    func(val);
  } catch (_err) {
    err = _err;
  }
  assert.instanceOf(err, TypeError);
  assert.strictEqual(err.value, val);
};

exports.expectReferenceError = function (func, val) {
  let err;
  try {
    func(val);
  } catch (_err) {
    err = _err;
  }
  assert.instanceOf(err, ReferenceError);
};
