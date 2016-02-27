/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('underscore');

function toValidationError(value) {
  let err = new TypeError('validation error');
  err.value = value;
  return err;
}


module.exports = (expectedType) => {
  let validator = (val) => {
    let origValue = val;

    if (_.isUndefined(val)) {
      if (validator._isOptional) {
        return val;
      } else {
        throw new ReferenceError('missing value');
      }
    }

    if (validator._allowed && _.contains(validator._allowed, val)) {
      return val;
    }

    if (validator._valid) {
      if (_.contains(validator._valid, val)) {
        return val;
      }

      throw toValidationError(origValue);
    }

    let actualType = Object.prototype.toString.call(val);
    if (actualType !== validator.expectedType && validator._convert) {
      val = validator._convert(val);
    }

    actualType = Object.prototype.toString.call(val);
    if (actualType !== validator.expectedType) {
      throw toValidationError(origValue);
    }

    if (validator._validator && ! validator._validator(val)) {
      throw toValidationError(origValue);
    }

    return val;
  };
  validator.expectedType = expectedType;

  validator.allow = function (val) {
    if (! validator._allowed) {
      validator._allowed = [];
    }

    validator._allowed.push(val);
    return validator;
  };

  validator.as = function (name) {
    if (arguments.length === 0) {
      return validator._as;
    }

    validator._as = name;
    return this;
  };

  validator.valid = function (val) {
    if (! validator._valid) {
      validator._valid = [];
    }

    validator._valid.push(val);
    return validator;
  };

  validator.optional = function () {
    validator._isOptional = true;
    return validator;
  };

  validator.required = function () {
    validator._isOptional = false;
    return validator;
  };

  return validator;
};


