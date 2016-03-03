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

describe('types/number', () => {
  let func;

  beforeEach(() => {
    func = Validator.number();
  });

  it('returns a function', () => {
    assert.isFunction(func);
  });

  it('succeeds for numeric values or values that can be transformed to boolean', () => {
    expectSuccess(func, 0);
    expectSuccess(func, '1', 1);
    expectSuccess(func, Infinity);
    expectSuccess(func, '3.1415', 3.1415);
  });

  it('throws a TypeError if not', () => {
    expectTypeError(func, true);
    expectTypeError(func, false);
    expectTypeError(func, {});
    expectTypeError(func, []);
    expectTypeError(func, '');
    expectTypeError(func, 'NaN');
    expectTypeError(func, '3.1415notanumber');
    expectTypeError(func, 'asdf.jkl');
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
