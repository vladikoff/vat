/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, describe, beforeEach, before, after, it*/

'use strict'; //jshint ignore:line

const assert = require('chai').assert;
const Helpers = require('../lib/helpers');
const vat = require('../../lib/vat');

const expectSuccess = Helpers.expectSuccess;
const expectReferenceError = Helpers.expectReferenceError;

describe('custom type', () => {
  before(() => {
    vat.register('custom',
      vat.any().test(val => val === true));
  });

  after(() => {
    vat.unregister('custom');
  });

  describe('optional', () => {
    let schema;

    beforeEach(() => {
      schema = vat.custom();
    });

    it('success', () => {
      expectSuccess(schema, true, true);

      // optional by default
      expectSuccess(schema, undefined);
    });
  });

  describe('required', () => {
    let schema;

    beforeEach(() => {
      schema = vat.custom().required();
    });

    it('success', () => {
      expectSuccess(schema, true, true);
    });

    it('throws when expected', () => {
      // optional by default
      expectReferenceError(schema, undefined);
    });
  });
});
