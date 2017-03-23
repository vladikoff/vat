/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, before, beforeEach, afterEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const vat = require('../../lib/vat');

const isSchema = Helpers.isSchema;

const RESERVED_NAMES = ['register', 'unregister', 'validate'];

const expectSuccess = Helpers.expectSuccess;
const expectTypeError = Helpers.expectTypeError;

function expectError(callback, ErrorType) {
  let err;
  try {
    callback();
  } catch (_err) {
    err = _err;
  }

  assert.instanceOf(err, ErrorType);
}

describe('lib/vat', () => {
  describe('interface', () => {
    it('exports the expected inteface', () => {
      assert.isFunction(vat.any);
      assert.isFunction(vat.boolean);
      assert.isFunction(vat.number);
      assert.isFunction(vat.register);
      assert.isFunction(vat.string);
      assert.isFunction(vat.validate);
    });
  });

  describe('validate', () => {
    let result;

    describe('simple values', () => {
      let schema = vat.string().valid('valid');

      describe('with valid, defined, data', () => {
        beforeEach(() => {
          result = vat.validate('valid', schema);
        });

        it('returns an object with undefined `error`', () => {
          assert.isUndefined(result.error);
        });

        it('returns an object with `value`', () => {
          assert.equal(result.value, 'valid');
        });
      });


      describe('with valid, undefined, data', () => {
        beforeEach(() => {
          result = vat.validate(undefined, schema);
        });

        it('returns an object with undefined `error`', () => {
          assert.isUndefined(result.error);
        });

        it('returns an object with `value`', () => {
          assert.isUndefined(result.value);
        });
      });

      describe('with invalid data', () => {
        beforeEach(() => {
          result = vat.validate('invalid', schema);
        });

        it('returns an object with an `error`', () => {
          assert.instanceOf(result.error, TypeError);
        });
      });
    });

    describe('complex values', () => {
      let schema = {
        optional: vat.string().optional(),
        required: vat.string().required(),
        requiredValid: vat.string().required().valid('valid')
      };

      describe('with valid data', () => {
        beforeEach(() => {
          result = vat.validate({ required: 'value', requiredValid: 'valid' }, schema);
        });

        it('returns an object with a null `error`', () => {
          assert.isNull(result.error);
        });

        it('returns an object with `value` with expected fields', () => {
          assert.isObject(result.value);
          assert.equal(Object.keys(result.value).length, 2);
        });

        it('sets the correct field value', () => {
          assert.equal(result.value.required, 'value');
          assert.equal(result.value.requiredValid, 'valid');
        });

      });

      describe('with missing data for field with `valid`', () => {
        beforeEach(() => {
          result = vat.validate({ required: 'value' }, schema);
        });

        it('returns an object with `error`', () => {
          assert.instanceOf(result.error, ReferenceError);
          assert.equal(result.error.key, 'requiredValid');
        });
      });

      describe('with missing data for field without `valid`', () => {
        beforeEach(() => {
          result = vat.validate({ requiredValid: 'valid' }, schema);
        });

        it('returns an object with `error`', () => {
          assert.instanceOf(result.error, ReferenceError);
          assert.equal(result.error.key, 'required');
        });
      });

      describe('with invalid data', () => {
        beforeEach(() => {
          result = vat.validate({ required: 'value', requiredValid: 'invalid' }, schema);
        });

        it('returns an object with `error`', () => {
          assert.instanceOf(result.error, TypeError);
          assert.equal(result.error.key, 'requiredValid');
        });
      });

      describe('with a key that is renamed', () => {
        beforeEach(() => {
          schema = {
            source: vat.string().renameTo('target')
          };
          result = vat.validate({ source: 'value' }, schema);
        });

        it('renames the key to the target', () => {
          assert.isFalse('source' in result.value);
          assert.equal(result.value.target, 'value');
        });
      });

      describe('with a value that is transformed', () => {
        beforeEach(() => {
          schema = {
            bool: vat.boolean()
          };
          result = vat.validate({ bool: 'true' }, schema);
        });

        it('returns the transformed value', () => {
          assert.isTrue(result.value.bool);
        });
      });

      describe('with an extra key', () => {
        beforeEach(() => {
          schema = {
            bool: vat.boolean()
          };
        });

        describe('allowUnknown: false (default)', () => {
          beforeEach(() => {
            result = vat.validate({ bool: 'true', string: 'a string' }, schema);
          });

          it('errors on the extra field', () => {
            assert.ok(result.error);
            assert.equal(result.error.key, 'string');
          });
        });


        describe('allowUnknown: true', () => {
          beforeEach(() => {
            result = vat.validate({ bool: true, string: 'a string' }, schema, { allowUnknown: true });
          });

          it('does not error with extra field', () => {
            assert.isNull(result.error);
            assert.equal(result.value.bool, true);
            assert.equal(result.value.string, 'a string');
          });
        });
      });
    });
  });

  describe('register', () => {
    let ourSchema = vat.string().test((val) => {
      return /value/.test(val);
    });

    describe('reserved', () => {
      RESERVED_NAMES.forEach((reservedName) => {
        it('throws', () => {
          expectError(() => {
            vat.register(reservedName, ourSchema);
          }, Error);
        });
      });
    });

    describe('with a name that is already registered', () => {
      it('throws', () => {
        expectError(() => {
          vat.register('string', ourSchema);
        }, Error);
      });
    });

    describe('with an unregistered name', () => {
      beforeEach(() => {
        vat.register('ourtype', ourSchema);
      });

      afterEach(() => {
        vat.unregister('ourtype');
      });

      it('allows a new schema to be fetched with the registered name', () => {
        let schema = vat.ourtype();
        assert.isTrue(isSchema(schema));
      });
    });
  });

  describe('unregister', () => {
    describe('reserved', () => {
      RESERVED_NAMES.forEach((reservedName) => {
        it('throws', () => {
          expectError(() => {
            vat.unregister(reservedName);
          }, Error);
        });
      });
    });

    describe('an item that is not registered', () => {
      it('throws', () => {
        expectError(() => {
          vat.unregister('not-registered');
        }, Error);
      });
    });

    describe('an item that is registered', () => {
      let ourSchema = vat.string().test((val) => {
        return /value/.test(val);
      });

      beforeEach(() => {
        vat.register('ourtype', ourSchema);
      });

      it('succeeds', () => {
        let schema = vat.ourtype();
        assert.isTrue(isSchema(schema));

        vat.unregister('ourtype');

        expectError(() => {
          schema = vat.ourtype();
        }, Error);
      });
    });
  });

  describe('extend a built in type', () => {
    let numberSchema = vat.number();
    numberSchema.less = function (limit) {
      return this.test((val) => {
        return val < limit;
      });
    };

    describe('added function', () => {
      it('is available', () => {
        assert.isFunction(vat.number().less);
      });

      it('runs as expected', () => {
        let mustBeLessSchema = vat.number().less(5);

        expectTypeError(mustBeLessSchema, 5);
        expectSuccess(mustBeLessSchema, 4);
      });
    });
  });
});
