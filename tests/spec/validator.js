/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, beforeEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Validator = require('../../lib/validator');

function expectSuccess(func, val, expected) {
  if (arguments.length === 2) {
    expected = val;
  }

  var result = func(val);

  assert.strictEqual(result, expected);

  return result;
}

function expectTypeError(func, val) {
  var err;
  try {
    func(val);
  } catch (_err) {
    err = _err;
  }
  assert.instanceOf(err, TypeError);
  assert.strictEqual(err.value, val);
}

function expectReferenceError(func, val) {
  var err;
  try {
    func(val);
  } catch (_err) {
    err = _err;
  }
  assert.instanceOf(err, ReferenceError);
}

describe('lib/validator', function () {
  describe('any', function () {
    var func;

    beforeEach(function () {
      func = Validator.any();
    });

    it('returns a function', function () {
      assert.isFunction(func);
    });

    it('success', function () {
      expectSuccess(func, '', '');
      expectSuccess(func, '123', '123');
      expectSuccess(func, 123, 123);
    });

    it('throws a ReferenceError if undefined', function () {
      expectReferenceError(func, undefined);
    });

    describe('with `optional`', function () {
      beforeEach(function () {
        func = null;
        func = Validator.any().optional();
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('returns `true` for strings', function () {
        expectSuccess(func, '');
        expectSuccess(func, '123');
      });


      it('returns `true` if the value is undefined', function () {
        expectSuccess(func, undefined);
      });
    });

    describe('with `required`', function () {
      beforeEach(function () {
        func = null;
        // required overrules optional
        func = Validator.any().optional().required();
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('returns `true` for any values as long as they are defined', function () {
        expectSuccess(func, '');
        expectSuccess(func, '123');
      });

      it('throws a ReferenceError if undefined', function () {
        expectReferenceError(func, undefined);
      });
    });

    describe('with `use`', function () {
      beforeEach(function () {
        func = null;
        func = Validator.any().use(function (val) {
          return /^valid/.test(val);
        });
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('returns `true` for strings that pass the validation function', function () {
        expectSuccess(func, 'valid1');
        expectSuccess(func, 'valid2');
      });

      it('throws a TypeError for items that do not pass the validation function', function () {
        expectTypeError(func, 123);
        expectTypeError(func, '123');
      });

      describe('with chained `use`', () => {
        beforeEach(() => {
          func = null;
          func = Validator.any().use((val) => {
            return /^valid/.test(val);
          }).use((val) => {
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

        it('throws a TypeError for strings that do not pass the validation function', function () {
          expectTypeError(func, 'validname');
          expectTypeError(func, 'invalid.name');
        });
      });
    });

    describe('with `allow`', function () {
      beforeEach(function () {
        func = null;
        func = Validator.any().use(function (val) {
          return /^valid/.test(val);
        }).allow('');
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('returns `true` for items that pass the validation function', function () {
        expectSuccess(func, 'valid1');
        expectSuccess(func, 'valid2');
      });

      it('returns `true` for tems that are allowed', function () {
        expectSuccess(func, '');
      });

      it('throws a TypeError for items that do not pass the validation function', function () {
        expectTypeError(func, '123');
      });
    });

    describe('with `valid`', function () {
      beforeEach(function () {
        func = null;
        func = Validator.any().valid('this').valid('or').valid('that').valid(1);
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('returns `true` for items that are valid', function () {
        expectSuccess(func, 'this');
        expectSuccess(func, 'or');
        expectSuccess(func, 'that');
        expectSuccess(func, 1);
      });

      it('throws a TypeError for all other values', function () {
        expectTypeError(func, '');
        expectTypeError(func, 'hey');
      });
    });

    describe('with `as`', function () {
      beforeEach(function () {
        func = null;
        func = Validator.any().as('target');
      });

      it('setter returns a function', function () {
        assert.isFunction(func);
      });

      it('getter returns value', function () {
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

  describe('string', function () {
    var func;

    beforeEach(function () {
      func = Validator.string();
    });

    it('returns a function', function () {
      assert.isFunction(func);
    });

    it('success', function () {
      expectSuccess(func, '', '');
      expectSuccess(func, '123', '123');
      // strings are trimmed by default
      expectSuccess(func, ' 123', '123');
      expectSuccess(func, '123 ', '123');
    });

    it('throws a ReferenceError if undefined', function () {
      expectReferenceError(func, undefined);
    });

    it('throws a TypeError for non-strings', function () {
      expectTypeError(func, null);
      expectTypeError(func, true);
      expectTypeError(func, 1);
      expectTypeError(func, {});
      expectTypeError(func, []);
    });

    describe('strict', function () {
      beforeEach(function () {
        func = Validator.string().strict();
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('success', function () {
        // strings are not trimmed
        expectSuccess(func, ' 123', ' 123');
        expectSuccess(func, '123 ', '123 ');
      });
    });

    describe('len', function () {
      beforeEach(function () {
        func = Validator.string().len(2);
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('success', function () {
        expectSuccess(func, '12', '12');
      });

      it('throws a TypeError if too short', function () {
        expectTypeError(func, '');
        expectTypeError(func, '1');
      });

      it('throws a TypeError if too long', function () {
        expectTypeError(func, '123');
      });
    });

    describe('min', function () {
      beforeEach(function () {
        func = Validator.string().min(2);
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('success', function () {
        expectSuccess(func, '12', '12');
        expectSuccess(func, '123', '123');
      });

      it('throws a TypeError if too short', function () {
        expectTypeError(func, '');
        expectTypeError(func, '1');
      });
    });

    describe('max', function () {
      beforeEach(function () {
        func = Validator.string().max(2);
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('success', function () {
        expectSuccess(func, '', '');
        expectSuccess(func, '1', '1');
        expectSuccess(func, '12', '12');
      });

      it('throws a TypeError if too long', function () {
        expectTypeError(func, '123');
        expectTypeError(func, '124');
      });
    });
  });

  describe('boolean', function () {
    var func;

    beforeEach(function () {
      func = Validator.boolean();
    });

    it('returns a function', function () {
      assert.isFunction(func);
    });

    it('returns `true` for boolean values or values that can be transformed to boolean', function () {
      expectSuccess(func, true);
      expectSuccess(func, 'true', true);
      expectSuccess(func, false);
      expectSuccess(func, 'false', false);
    });

    it('throws a TypeError if not', function () {
      expectTypeError(func, 0);
      expectTypeError(func, 1);
      expectTypeError(func, {});
      expectTypeError(func, []);
    });

    describe('strict', function () {
      beforeEach(function () {
        func = Validator.boolean().strict();
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('throws for values that can be transformed to boolean', function () {
        expectTypeError(func, 'true');
        expectTypeError(func, 'false');
      });
    });
  });

  describe('number', function () {
    var func;

    beforeEach(function () {
      func = Validator.number();
    });

    it('returns a function', function () {
      assert.isFunction(func);
    });

    it('succeeds for numeric values or values that can be transformed to boolean', function () {
      expectSuccess(func, 0);
      expectSuccess(func, '1', 1);
      expectSuccess(func, Infinity);
      expectSuccess(func, '3.1415', 3.1415);
    });

    it('throws a TypeError if not', function () {
      expectTypeError(func, true);
      expectTypeError(func, false);
      expectTypeError(func, {});
      expectTypeError(func, []);
      expectTypeError(func, '');
      expectTypeError(func, 'NaN');
      expectTypeError(func, '3.1415notanumber');
      expectTypeError(func, 'asdf.jkl');
    });

    describe('strict', function () {
      beforeEach(function () {
        func = Validator.boolean().strict();
      });

      it('returns a function', function () {
        assert.isFunction(func);
      });

      it('throws for values that can be transformed to boolean', function () {
        expectTypeError(func, 'true');
        expectTypeError(func, 'false');
      });
    });
  });

  describe('validate', function () {
    var result;

    describe('simple values', function () {
      var schema = Validator.string().required().valid('valid');

      describe('with valid data', function () {
        beforeEach(function () {
          result = Validator.validate('valid', schema);
        });

        it('returns an object with a null `error`', function () {
          assert.isNull(result.error);
        });

        it('returns an object with `value`', function () {
          assert.equal(result.value, 'valid');
        });
      });

      describe('with invalid data', function () {
        beforeEach(function () {
          result = Validator.validate('invalid', schema);
        });

        it('returns an object with an `error`', function () {
          assert.instanceOf(result.error, TypeError);
        });

      });
    });

    describe('complex values', function () {
      var schema = {
        optional: Validator.string().optional(),
        required: Validator.string().required().valid('valid')
      };

      describe('with valid data', function () {
        beforeEach(function () {
          result = Validator.validate({ required: 'valid' }, schema);
        });

        it('returns an object with a null `error`', function () {
          assert.isNull(result.error);
        });

        it('returns an object with `value` with expected fields', function () {
          assert.isObject(result.value);
          assert.equal(Object.keys(result.value).length, 1);
        });

        it('sets the correct field value', function () {
          assert.equal(result.value.required, 'valid');
        });

      });

      describe('with missing data', function () {
        beforeEach(function () {
          result = Validator.validate({}, schema);
        });

        it('returns an object with `error`', function () {
          assert.instanceOf(result.error, ReferenceError);
          assert.equal(result.error.key, 'required');
        });
      });

      describe('with invalid data', function () {
        beforeEach(function () {
          result = Validator.validate({ required: 'invalid' }, schema);
        });

        it('returns an object with `error`', function () {
          assert.instanceOf(result.error, TypeError);
          assert.equal(result.error.key, 'required');
        });
      });

      describe('with a key that is renamed', function () {
        beforeEach(function () {
          schema = {
            source: Validator.string().as('target')
          };
          result = Validator.validate({ source: 'value' }, schema);
        });

        it('renames the key to the target', function () {
          assert.isFalse('source' in result.value);
          assert.equal(result.value.target, 'value');
        });
      });

      describe('with a value that is transformed', function () {
        beforeEach(function () {
          schema = {
            bool: Validator.boolean()
          };
          result = Validator.validate({ bool: 'true' }, schema);
        });

        it('returns the transformed value', function () {
          assert.isTrue(result.value.bool);
        });
      });
    });
  });
});
