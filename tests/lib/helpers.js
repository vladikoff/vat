/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, exports */

'use strict'; //jshint ignore:line

const assert = require('chai').assert;

function validate(schema, value) {
  return schema.validate ? schema.validate(value) : schema(value);
}

exports.expectSuccess = function (schema, value, expected) {
  if (arguments.length === 2) {
    expected = value;
  }

  let result = validate(schema, value);

  assert.strictEqual(result, expected);

  return result;
};

exports.expectTypeError = function (schema, value) {
  let err;
  try {
    validate(schema, value);
  } catch (_err) {
    err = _err;
  }
  assert.instanceOf(err, TypeError);
  assert.strictEqual(err.value, value);
};

exports.expectRangeError = function (schema, value) {
  let err;
  try {
    validate(schema, value);
  } catch (_err) {
    err = _err;
  }
  assert.instanceOf(err, RangeError);
};

exports.expectReferenceError = function (schema, value) {
  let err;
  try {
    validate(schema, value);
  } catch (_err) {
    err = _err;
  }
  assert.instanceOf(err, ReferenceError);
};

/**
 * Is the item a schema
 */
exports.isSchema = function (schema) {
  return !! schema.validate;
};
