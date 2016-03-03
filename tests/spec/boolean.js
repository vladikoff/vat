/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, beforeEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const Validator = require('../../lib/validator');

const expectSuccess = Helpers.expectSuccess;
const expectTypeError = Helpers.expectTypeError;
const expectReferenceError = Helpers.expectReferenceError;

describe('types/boolean', () => {
  let func;

  beforeEach(() => {
    func = Validator.boolean();
  });

  it('returns a function', () => {
    assert.isFunction(func);
  });

  it('returns `true` for boolean values or values that can be transformed to boolean', () => {
    expectSuccess(func, true);
    expectSuccess(func, 'true', true);
    expectSuccess(func, false);
    expectSuccess(func, 'false', false);
  });

  it('throws a TypeError if not', () => {
    expectTypeError(func, 0);
    expectTypeError(func, 1);
    expectTypeError(func, {});
    expectTypeError(func, []);
  });

  describe('strict', () => {
    beforeEach(() => {
      func = Validator.boolean().strict();
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('throws for values that can be transformed to boolean', () => {
      expectTypeError(func, 'true');
      expectTypeError(func, 'false');
    });
  });
});



