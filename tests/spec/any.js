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
const isSchema = Helpers.isSchema;

describe('types/any', () => {
  let schema;

  beforeEach(() => {
    schema = Validator.any();
  });

  it('returns a schema', () => {
    assert.isTrue(isSchema(schema));
  });

  it('success', () => {
    expectSuccess(schema, '', '');
    expectSuccess(schema, '123', '123');
    expectSuccess(schema, 123, 123);

    // optional by default
    expectSuccess(schema, undefined);
  });

  describe('with `required`', () => {
    beforeEach(() => {
      schema = null;
      // required overrules optional
      schema = Validator.any().required();
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('returns `true` for any values as long as they are defined', () => {
      expectSuccess(schema, '');
      expectSuccess(schema, '123');
    });

    it('throws a ReferenceError if undefined', () => {
      expectReferenceError(schema, undefined);
    });
  });

  describe('with `optional`', () => {
    beforeEach(() => {
      schema = null;
      schema = Validator.any().optional();
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('returns `true` for strings', () => {
      expectSuccess(schema, '');
      expectSuccess(schema, '123');
    });


    it('returns `true` if the value is undefined', () => {
      expectSuccess(schema, undefined);
    });

    describe('`optional` after `required`', () => {
      beforeEach(() => {
        schema = null;
        schema = Validator.any().required().optional();
      });

      it('returns a schema', () => {
        assert.isTrue(isSchema(schema));
      });

      it('has no real effect, `required` takes precedence, error is thrown', () => {
        expectReferenceError(schema, undefined);
      });
    });
  });


  describe('with `test`', () => {
    beforeEach(() => {
      schema = null;
      schema = Validator.any().test((val) => {
        return /^valid/.test(val);
      });
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('returns `true` for strings that pass the validation function', () => {
      expectSuccess(schema, 'valid1');
      expectSuccess(schema, 'valid2');
    });

    it('throws a TypeError for items that do not pass the validation function', () => {
      expectTypeError(schema, 123);
      expectTypeError(schema, '123');
    });

    describe('with chained `test`', () => {
      beforeEach(() => {
        schema = null;
        schema = Validator.any().test((val) => {
          return /^valid/.test(val);
        }).test((val) => {
          return /\.name$/.test(val);
        });
      });

      it('returns a schema', () => {
        assert.isTrue(isSchema(schema));
      });

      it('returns `true` for strings that pass the validation function', () => {
        expectSuccess(schema, 'valid.name');
        expectSuccess(schema, 'valid1.name');
        expectSuccess(schema, 'valid.with.lots.of.random.stuff.name');
      });

      it('throws a TypeError for strings that do not pass the validation function', () => {
        expectTypeError(schema, 'validname');
        expectTypeError(schema, 'invalid.name');
      });
    });
  });

  describe('with `allow`', () => {
    beforeEach(() => {
      schema = null;
      schema = Validator.any().test((val) => {
        return /^valid/.test(val);
      }).allow('');
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('returns `true` for items that pass the validation function', () => {
      expectSuccess(schema, 'valid1');
      expectSuccess(schema, 'valid2');
    });

    it('returns `true` for tems that are allowed', () => {
      expectSuccess(schema, '');
    });

    it('throws a TypeError for items that do not pass the validation function', () => {
      expectTypeError(schema, '123');
    });
  });

  describe('with `valid`', () => {
    beforeEach(() => {
      schema = null;
      schema = Validator.any().valid('this').valid('or').valid('that').valid(1);
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('returns `true` for items that are valid', () => {
      expectSuccess(schema, 'this');
      expectSuccess(schema, 'or');
      expectSuccess(schema, 'that');
      expectSuccess(schema, 1);
    });

    it('throws a TypeError for all other values', () => {
      expectTypeError(schema, '');
      expectTypeError(schema, 'hey');
    });
  });

  describe('with `as`', () => {
    beforeEach(() => {
      schema = null;
      schema = Validator.any().as('target');
    });

    it('setter returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('getter returns value', () => {
      assert.equal(schema.as(), 'target');
    });
  });

  describe('with `transform`', () => {
    beforeEach(() => {
      schema = null;
      schema = Validator.any().transform((val) => {
        return val + '.suffix';
      }).transform((val) => {
        return val + '.second.suffix';
      });
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('function returns the transformed value', () => {
      assert.equal(schema.validate('hey'), 'hey.suffix.second.suffix');
    });
  });
});
