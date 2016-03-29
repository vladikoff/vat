/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, beforeEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const vat = require('../../lib/vat');

const expectSuccess = Helpers.expectSuccess;
const expectTypeError = Helpers.expectTypeError;
const expectReferenceError = Helpers.expectReferenceError;
const isSchema = Helpers.isSchema;

describe('types/boolean', () => {
  let schema;

  beforeEach(() => {
    schema = vat.boolean();
  });

  it('returns a schema', () => {
    assert.isTrue(isSchema(schema));
  });

  it('returns `true` for boolean values or values that can be transformed to boolean', () => {
    expectSuccess(schema, true);
    expectSuccess(schema, 'true', true);
    expectSuccess(schema, false);
    expectSuccess(schema, 'false', false);
  });

  it('throws a TypeError if not', () => {
    expectTypeError(schema, 0);
    expectTypeError(schema, 1);
    expectTypeError(schema, {});
    expectTypeError(schema, []);
  });

  describe('strict', () => {
    beforeEach(() => {
      schema = vat.boolean().strict();
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('throws for values that can be transformed to boolean', () => {
      expectTypeError(schema, 'true');
      expectTypeError(schema, 'false');
    });
  });
});



