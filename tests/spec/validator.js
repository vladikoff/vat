/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, beforeEach, afterEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const Validator = require('../../lib/validator');

const isSchema = Helpers.isSchema;

const RESERVED_NAMES = ['register', 'unregister', 'validate'];

function expectError(callback, ErrorType) {
  let err;
  try {
    callback();
  } catch (_err) {
    err = _err;
  }

  assert.instanceOf(err, ErrorType);
}

describe('lib/validator', () => {
  describe('interface', () => {
    it('exports the expected inteface', () => {
      assert.isFunction(Validator.any);
      assert.isFunction(Validator.boolean);
      assert.isFunction(Validator.number);
      assert.isFunction(Validator.register);
      assert.isFunction(Validator.string);
      assert.isFunction(Validator.validate);
    });
  });

  describe('validate', () => {
    let result;

    describe('simple values', () => {
      let schema = Validator.string().valid('valid');

      describe('with valid, defined, data', () => {
        beforeEach(() => {
          result = Validator.validate('valid', schema);
        });

        it('returns an object with a null `error`', () => {
          assert.isNull(result.error);
        });

        it('returns an object with `value`', () => {
          assert.equal(result.value, 'valid');
        });
      });


      describe('with valid, undefined, data', () => {
        beforeEach(() => {
          result = Validator.validate(undefined, schema);
        });

        it('returns an object with a null `error`', () => {
          assert.isNull(result.error);
        });

        it('returns an object with `value`', () => {
          assert.isUndefined(result.value);
        });
      });

      describe('with invalid data', () => {
        beforeEach(() => {
          result = Validator.validate('invalid', schema);
        });

        it('returns an object with an `error`', () => {
          assert.instanceOf(result.error, TypeError);
        });
      });
    });

    describe('complex values', () => {
      let schema = {
        optional: Validator.string().optional(),
        required: Validator.string().required(),
        requiredValid: Validator.string().required().valid('valid')
      };

      describe('with valid data', () => {
        beforeEach(() => {
          result = Validator.validate({ required: 'value', requiredValid: 'valid' }, schema);
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
          result = Validator.validate({ required: 'value' }, schema);
        });

        it('returns an object with `error`', () => {
          assert.instanceOf(result.error, ReferenceError);
          assert.equal(result.error.key, 'requiredValid');
        });
      });

      describe('with missing data for field without `valid`', () => {
        beforeEach(() => {
          result = Validator.validate({ requiredValid: 'valid' }, schema);
        });

        it('returns an object with `error`', () => {
          assert.instanceOf(result.error, ReferenceError);
          assert.equal(result.error.key, 'required');
        });
      });

      describe('with invalid data', () => {
        beforeEach(() => {
          result = Validator.validate({ required: 'value', requiredValid: 'invalid' }, schema);
        });

        it('returns an object with `error`', () => {
          assert.instanceOf(result.error, TypeError);
          assert.equal(result.error.key, 'requiredValid');
        });
      });

      describe('with a key that is renamed', () => {
        beforeEach(() => {
          schema = {
            source: Validator.string().as('target')
          };
          result = Validator.validate({ source: 'value' }, schema);
        });

        it('renames the key to the target', () => {
          assert.isFalse('source' in result.value);
          assert.equal(result.value.target, 'value');
        });
      });

      describe('with a value that is transformed', () => {
        beforeEach(() => {
          schema = {
            bool: Validator.boolean()
          };
          result = Validator.validate({ bool: 'true' }, schema);
        });

        it('returns the transformed value', () => {
          assert.isTrue(result.value.bool);
        });
      });
    });
  });

  describe('register', () => {
    let ourSchema = Validator.string().test((val) => {
      return /value/.test(val);
    });

    describe('reserved', () => {
      RESERVED_NAMES.forEach((reservedName) => {
        it('throws', () => {
          expectError(() => {
            Validator.register(reservedName, ourSchema);
          }, Error);
        });
      });
    });

    describe('with a name that is already registered', () => {
      it('throws', () => {
        expectError(() => {
          Validator.register('string', ourSchema);
        }, Error);
      });
    });

    describe('with an unregistered name', () => {
      beforeEach(() => {
        Validator.register('ourtype', ourSchema);
      });

      afterEach(() => {
        Validator.unregister('ourtype');
      });

      it('allows a new schema to be fetched with the registered name', () => {
        let schema = Validator.ourtype();
        assert.isTrue(isSchema(schema));
      });
    });
  });

  describe('unregister', () => {
    describe('reserved', () => {
      RESERVED_NAMES.forEach((reservedName) => {
        it('throws', () => {
          expectError(() => {
            Validator.unregister(reservedName);
          }, Error);
        });
      });
    });

    describe('an item that is not registered', () => {
      it('throws', () => {
        expectError(() => {
          Validator.unregister('not-registered');
        }, Error);
      });
    });

    describe('an item that is registered', () => {
      let ourSchema = Validator.string().test((val) => {
        return /value/.test(val);
      });

      beforeEach(() => {
        Validator.register('ourtype', ourSchema);
      });

      it('succeeds', () => {
        let schema = Validator.ourtype();
        assert.isTrue(isSchema(schema));

        Validator.unregister('ourtype');

        expectError(() => {
          schema = Validator.ourtype();
        }, Error);
      });
    });
  });
});
