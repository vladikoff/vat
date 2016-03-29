/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, before, beforeEach, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const vat = require('../../lib/vat');

const expectSuccess = Helpers.expectSuccess;
const expectTypeError = Helpers.expectTypeError;
const expectReferenceError = Helpers.expectReferenceError;
const isSchema = Helpers.isSchema;

describe('types/any', () => {
  describe('with no modifiers', function () {
    let schema;

    before(() => {
      schema = vat.any();
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
  });

  describe('required', () => {
    let schema;

    before(() => {
      schema = vat.any().required();
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('succeeds for any values as long as they are defined', () => {
      expectSuccess(schema, '');
      expectSuccess(schema, '123');
    });

    it('throws a ReferenceError if undefined', () => {
      expectReferenceError(schema, undefined);
    });

    describe('with further tests', () => {
      let schema;

      beforeEach(() => {
        schema = vat.any().test(val => val === true).required();
      });

      it('succeeds when expected', () => {
        expectSuccess(schema, true);
      });

      it('fails when expected', () => {
        expectTypeError(schema, false);
        expectTypeError(schema, '123');
      });

      it('throws a ReferenceError if undefined', () => {
        expectReferenceError(schema, undefined);
      });
    });
  });

  describe('optional', () => {
    let schema;

    before(() => {
      schema = vat.any().optional();
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('succeeds for strings', () => {
      expectSuccess(schema, '');
      expectSuccess(schema, '123');
    });

    it('returns value if the value is undefined', () => {
      expectSuccess(schema, undefined);
    });

    describe('`optional` after `required`', () => {
      let schema;

      before(() => {
        schema = vat.any().required().optional();
      });

      it('returns a schema', () => {
        assert.isTrue(isSchema(schema));
      });

      it('has no real effect, `required` takes precedence, error is thrown', () => {
        expectReferenceError(schema, undefined);
      });
    });
  });

  describe('test', () => {
    let schema;

    before(() => {
      schema = vat.any().test((val) => {
        return /^valid/.test(val);
      });
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('succeeds for undefined if optional', () => {
      expectSuccess(schema, undefined);
    });

    it('succeeds for strings that pass the validation function', () => {
      expectSuccess(schema, 'valid1');
      expectSuccess(schema, 'valid2');
    });

    it('throws a TypeError for items that do not pass the validation function', () => {
      expectTypeError(schema, 123);
      expectTypeError(schema, '123');
    });

    describe('with chained `test`', () => {
      let schema;

      before(() => {
        schema = vat.any().test((val) => {
          return /^valid/.test(val);
        }).test((val) => {
          return /\.name$/.test(val);
        });
      });

      it('returns a schema', () => {
        assert.isTrue(isSchema(schema));
      });

      it('succeeds for strings that pass all validation functions', () => {
        expectSuccess(schema, 'valid.name');
        expectSuccess(schema, 'valid1.name');
        expectSuccess(schema, 'valid.with.lots.of.random.stuff.name');
      });

      it('throws a TypeError for strings that do not pass all validation functions', () => {
        expectTypeError(schema, 'validname');
        expectTypeError(schema, 'invalid.name');
      });
    });
  });

  describe('allow', () => {
    let schema;

    before(() => {
      schema = vat.any().test((val) => {
        return /^valid/.test(val);
      }).allow('');
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('succeeds for items that pass the validation function', () => {
      expectSuccess(schema, 'valid1');
      expectSuccess(schema, 'valid2');
    });

    it('succeeds for items that are allowed', () => {
      expectSuccess(schema, '');
    });

    it('throws a TypeError for items that do not pass the validation function', () => {
      expectTypeError(schema, '123');
    });

    describe('with multiple values', () => {
      let schema;

      before(() => {
        schema = vat.any().test((val) => {
          return /^valid/.test(val);
        }).allow('', 'value');
      });

      it('returns a schema', () => {
        assert.isTrue(isSchema(schema));
      });

      it('succeeds for items that pass the validation function', () => {
        expectSuccess(schema, 'valid1');
        expectSuccess(schema, 'valid2');
      });

      it('succeeds for items that are allowed', () => {
        expectSuccess(schema, '');
        expectSuccess(schema, 'value');
      });

      it('throws a TypeError for items that do not pass the validation function', () => {
        expectTypeError(schema, '123');
      });

    });
  });

  describe('valid', () => {
    let schema;

    before(() => {
      schema = vat.any().valid('this').valid('or').valid('that').valid(1);
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('succeeds for items that are valid', () => {
      expectSuccess(schema, 'this');
      expectSuccess(schema, 'or');
      expectSuccess(schema, 'that');
      expectSuccess(schema, 1);
      expectSuccess(schema, undefined);
    });

    it('throws a TypeError for all other values', () => {
      expectTypeError(schema, '');
      expectTypeError(schema, 'hey');
    });

    describe('and `required`', () => {
      let schema;

      before(() => {
        schema = vat.any().required().valid('value');
      });

      it('returns a schema', () => {
        assert.isTrue(isSchema(schema));
      });

      it('succeeds for items that are valid', () => {
        expectSuccess(schema, 'value');
      });

      it('throws a ReferenceError for undefined values', () => {
        expectReferenceError(schema, undefined);
      });
    });

    describe('multiple items', () => {
      let schema;

      before(() => {
        schema = vat.any().valid('this', 'or', 'that', 1);
      });

      it('returns a schema', () => {
        assert.isTrue(isSchema(schema));
      });

      it('succeeds for items that are valid', () => {
        expectSuccess(schema, 'this');
        expectSuccess(schema, 'or');
        expectSuccess(schema, 'that');
        expectSuccess(schema, 1);
        expectSuccess(schema, undefined);
      });

      it('throws a TypeError for all other values', () => {
        expectTypeError(schema, '');
        expectTypeError(schema, 'hey');
      });
    });
  });

  describe('renameTo', () => {
    let schema;

    before(() => {
      schema = vat.any().renameTo('target');
    });

    it('setter returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('getter returns value', () => {
      assert.equal(schema.renameTo(), 'target');
    });
  });

  describe('transform', () => {
    let schema;

    before(() => {
      schema = vat.any().transform((val) => {
        return val + '.suffix';
      }).transform((val) => {
        return val + '.second.suffix';
      });
    });

    it('returns a schema', () => {
      assert.isTrue(isSchema(schema));
    });

    it('function returns the transformed value', () => {
      assert.equal(schema.validate('hey').value, 'hey.suffix.second.suffix');
    });

    describe('and `valid`', () => {
      let schema;
      before(() => {
        schema = vat.any().transform((val) => {
          return val + '.suffix';
        }).valid('value.suffix');
      });

      it('does the transform before checking validity', () => {
        assert.equal(schema.validate('value').value, 'value.suffix');

        // converted to value.suffix.suffix
        expectTypeError(schema, 'value.suffix');
      });
    });
  });
});
