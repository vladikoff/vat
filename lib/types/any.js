/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('../ourscore');

function toValidationError(value) {
  let err = new TypeError('validation error');
  err.value = value;
  return err;
}

module.exports = () => {
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

    if (validator._transforms) {
      val = validator._transforms.reduce((val, converter) => {
        return converter(val);
      }, val);
    }

    if (validator._validators) {
      validator._validators.forEach((validator) => {
        if (! validator(val)) {
          throw toValidationError(origValue);
        }
      });
    }

    return val;
  };

  validator.allow = function (val) {
    if (! this._allowed) {
      this._allowed = [];
    }

    this._allowed.push(val);
    return this;
  };

  validator.as = function (name) {
    if (arguments.length === 0) {
      return this._as;
    }

    this._as = name;
    return this;
  };

  validator.optional = function () {
    this._isOptional = true;
    return this;
  };

  validator.required = function () {
    this._isOptional = false;
    return this;
  };

  validator.strict = function () {
    this._transforms = null;
    return this;
  };

  validator.transform = function (transformer) {
    if (! this._transforms) {
      this._transforms = [];
    }

    this._transforms.push(transformer);
    return this;
  };

  validator.use = function (validator) {
    if (! this._validators) {
      this._validators = [];
    }
    this._validators.push(validator);
    return this;
  };

  validator.valid = function (val) {
    if (! this._valid) {
      this._valid = [];
    }

    this._valid.push(val);
    return this;
  };

  return validator;
};


