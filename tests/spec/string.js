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

describe('types/string', () => {
  let func;

  beforeEach(() => {
    func = Validator.string();
  });

  it('returns a function', () => {
    assert.isFunction(func);
  });

  it('success', () => {
    expectSuccess(func, '', '');
    expectSuccess(func, '123', '123');
    // strings are trimmed by default
    expectSuccess(func, ' 123', '123');
    expectSuccess(func, '123 ', '123');
  });

  it('throws a ReferenceError if undefined', () => {
    expectReferenceError(func, undefined);
  });

  it('throws a TypeError for non-strings', () => {
    expectTypeError(func, null);
    expectTypeError(func, true);
    expectTypeError(func, 1);
    expectTypeError(func, {});
    expectTypeError(func, []);
  });

  describe('strict', () => {
    beforeEach(() => {
      func = Validator.string().strict();
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('success', () => {
      // strings are not trimmed
      expectSuccess(func, ' 123', ' 123');
      expectSuccess(func, '123 ', '123 ');
    });
  });

  describe('len', () => {
    beforeEach(() => {
      func = Validator.string().len(2);
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('success', () => {
      expectSuccess(func, '12', '12');
    });

    it('throws a TypeError if too short', () => {
      expectTypeError(func, '');
      expectTypeError(func, '1');
    });

    it('throws a TypeError if too long', () => {
      expectTypeError(func, '123');
    });
  });

  describe('min', () => {
    beforeEach(() => {
      func = Validator.string().min(2);
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('success', () => {
      expectSuccess(func, '12', '12');
      expectSuccess(func, '123', '123');
    });

    it('throws a TypeError if too short', () => {
      expectTypeError(func, '');
      expectTypeError(func, '1');
    });
  });

  describe('max', () => {
    beforeEach(() => {
      func = Validator.string().max(2);
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('success', () => {
      expectSuccess(func, '', '');
      expectSuccess(func, '1', '1');
      expectSuccess(func, '12', '12');
    });

    it('throws a TypeError if too long', () => {
      expectTypeError(func, '123');
      expectTypeError(func, '124');
    });
  });
});


