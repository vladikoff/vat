/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, beforeEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const Validator = require('../../lib/validator');

const expectRangeError = Helpers.expectRangeError;
const expectReferenceError = Helpers.expectReferenceError;
const expectSuccess = Helpers.expectSuccess;
const expectTypeError = Helpers.expectTypeError;
const isSchema = Helpers.isSchema;

describe('types/number', () => {
  let schema;

  beforeEach(() => {
    schema = Validator.number();
  });

  it('returns a schema', () => {
    assert.isTrue(isSchema(schema));
  });

  it('succeeds for numeric values or values that can be transformed to boolean', () => {
    expectSuccess(schema, 0);
    expectSuccess(schema, '1', 1);
    expectSuccess(schema, Infinity);
    expectSuccess(schema, '3.1415', 3.1415);
  });

  it('throws a TypeError if not', () => {
    expectTypeError(schema, true);
    expectTypeError(schema, false);
    expectTypeError(schema, {});
    expectTypeError(schema, []);
    expectTypeError(schema, '');
    expectTypeError(schema, 'NaN');
    expectTypeError(schema, '3.1415notanumber');
    expectTypeError(schema, 'asdf.jkl');
  });

  describe('strict', () => {
    beforeEach(() => {
      schema = Validator.number().strict();
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('throws for values that can be transformed to number', () => {
      expectTypeError(schema, '1');
      expectTypeError(schema, '2');
      expectTypeError(schema, '3.1415');
    });
  });

  describe('min', () => {
    beforeEach(() => {
      schema = Validator.number().min(5);
    });

    it('allows values >= value', () => {
      expectSuccess(schema, 5);
      expectSuccess(schema, 6);
    });

    it('throws a RangeError if value is too low', () => {
      expectRangeError(schema, 4);
      expectRangeError(schema, 4.5);
    });
  });

  describe('max', () => {
    beforeEach(() => {
      schema = Validator.number().max(5);
    });

    it('allows values <= value', () => {
      expectSuccess(schema, 5);
      expectSuccess(schema, 4);
    });

    it('throws a RangeError if value is too low', () => {
      expectRangeError(schema, 5.1);
      expectRangeError(schema, 6);
    });
  });
});
