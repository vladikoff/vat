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

describe('types/any', () => {
  let func;

  beforeEach(() => {
    func = Validator.any();
  });

  it('returns a function', () => {
    assert.isFunction(func);
  });

  it('success', () => {
    expectSuccess(func, '', '');
    expectSuccess(func, '123', '123');
    expectSuccess(func, 123, 123);
  });

  it('throws a ReferenceError if undefined', () => {
    expectReferenceError(func, undefined);
  });

  describe('with `optional`', () => {
    beforeEach(() => {
      func = null;
      func = Validator.any().optional();
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('returns `true` for strings', () => {
      expectSuccess(func, '');
      expectSuccess(func, '123');
    });


    it('returns `true` if the value is undefined', () => {
      expectSuccess(func, undefined);
    });
  });

  describe('with `required`', () => {
    beforeEach(() => {
      func = null;
      // required overrules optional
      func = Validator.any().optional().required();
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('returns `true` for any values as long as they are defined', () => {
      expectSuccess(func, '');
      expectSuccess(func, '123');
    });

    it('throws a ReferenceError if undefined', () => {
      expectReferenceError(func, undefined);
    });
  });

  describe('with `test`', () => {
    beforeEach(() => {
      func = null;
      func = Validator.any().test(function (val) {
        return /^valid/.test(val);
      });
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('returns `true` for strings that pass the validation function', () => {
      expectSuccess(func, 'valid1');
      expectSuccess(func, 'valid2');
    });

    it('throws a TypeError for items that do not pass the validation function', () => {
      expectTypeError(func, 123);
      expectTypeError(func, '123');
    });

    describe('with chained `test`', () => {
      beforeEach(() => {
        func = null;
        func = Validator.any().test((val) => {
          return /^valid/.test(val);
        }).test((val) => {
          return /\.name$/.test(val);
        });
      });

      it('returns a function', () => {
        assert.isFunction(func);
      });

      it('returns `true` for strings that pass the validation function', () => {
        expectSuccess(func, 'valid.name');
        expectSuccess(func, 'valid1.name');
        expectSuccess(func, 'valid.with.lots.of.random.stuff.name');
      });

      it('throws a TypeError for strings that do not pass the validation function', () => {
        expectTypeError(func, 'validname');
        expectTypeError(func, 'invalid.name');
      });
    });
  });

  describe('with `allow`', () => {
    beforeEach(() => {
      func = null;
      func = Validator.any().test(function (val) {
        return /^valid/.test(val);
      }).allow('');
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('returns `true` for items that pass the validation function', () => {
      expectSuccess(func, 'valid1');
      expectSuccess(func, 'valid2');
    });

    it('returns `true` for tems that are allowed', () => {
      expectSuccess(func, '');
    });

    it('throws a TypeError for items that do not pass the validation function', () => {
      expectTypeError(func, '123');
    });
  });

  describe('with `valid`', () => {
    beforeEach(() => {
      func = null;
      func = Validator.any().valid('this').valid('or').valid('that').valid(1);
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('returns `true` for items that are valid', () => {
      expectSuccess(func, 'this');
      expectSuccess(func, 'or');
      expectSuccess(func, 'that');
      expectSuccess(func, 1);
    });

    it('throws a TypeError for all other values', () => {
      expectTypeError(func, '');
      expectTypeError(func, 'hey');
    });
  });

  describe('with `as`', () => {
    beforeEach(() => {
      func = null;
      func = Validator.any().as('target');
    });

    it('setter returns a function', () => {
      assert.isFunction(func);
    });

    it('getter returns value', () => {
      assert.equal(func.as(), 'target');
    });
  });

  describe('with `transform`', () => {
    beforeEach(() => {
      func = null;
      func = Validator.any().transform((val) => {
        return val + '.suffix';
      }).transform((val) => {
        return val + '.second.suffix';
      });
    });

    it('returns a function', () => {
      assert.isFunction(func);
    });

    it('function returns the transformed value', () => {
      assert.equal(func('hey'), 'hey.suffix.second.suffix');
    });
  });
});
