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

    // Check the exclusive allowed list first. If an exclusive allowed list
    // is defined and the value is not a member of list, throw
    // a validation error
    if (validator._valid) {
      if (_.contains(validator._valid, val)) {
        return val;
      }

      throw toValidationError(origValue);
    }

    // Check against the allowed list. If the value is not a member
    // of the allowed list, continue
    if (validator._allowed && _.contains(validator._allowed, val)) {
      return val;
    }

    // Perform any transformations
    if (validator._transforms) {
      val = validator._transforms.reduce((val, transform) => {
        return transform(val);
      }, val);
    }

    // Finally, perform the validations.
    if (validator._validators) {
      validator._validators.forEach((validator) => {
        if (! validator(val)) {
          throw toValidationError(origValue);
        }
      });
    }

    return val;
  };

  /**
   * Explicitly allow a value, before any conversion
   *
   * @method allow
   * @param {variant} val
   */
  validator.allow = function (val) {
    if (! this._allowed) {
      this._allowed = [];
    }

    this._allowed.push(val);
    return this;
  };

  /**
   * Export the result as {name} in the results.
   *
   * @method as
   * @param {string} name
   */
  validator.as = function (name) {
    if (arguments.length === 0) {
      return this._as;
    }

    this._as = name;
    return this;
  };

  /**
   * Mark the field as optional. All fields are optional by default.
   *
   * @method optional
   */
  validator.optional = function () {
    return this;
  };

  /**
   * Mark the field as required
   *
   * @method required
   */
  validator.required = function () {
    this._isRequired = true;
    this.test((val) => {
      if (_.isUndefined(val)) {
        throw new ReferenceError('missing value');
      }
      return true;
    });
    return this;
  };

  /**
   * Remove any current transforms
   *
   * @method strict
   */
  validator.strict = function () {
    this._transforms = null;
    return this;
  };

  /**
   * Add a validation test function. Function will
   * be called with value being validated.
   *
   * @method test
   * @param {function} validator
   */
  validator.test = function (validator) {
    if (! this._validators) {
      this._validators = [];
    }
    this._validators.push(validator);
    return this;
  };

  /**
   * Add a transformer. A transformer is a function that accepts
   * a value and returns another value. Validation will occur
   * with returned value.
   *
   * @method transform
   * @param {function} transformer
   */
  validator.transform = function (transformer) {
    if (! this._transforms) {
      this._transforms = [];
    }

    this._transforms.push(transformer);
    return this;
  };

  /**
   * Create an exclusive allowed list of values.
   *
   * @method valid
   * @param {variant} val
   */
  validator.valid = function (val) {
    if (! this._valid) {
      this._valid = [];
    }

    this._valid.push(val);
    return this;
  };

  return validator;
};


