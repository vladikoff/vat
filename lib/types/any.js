/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('../utils');

function toValidationError(value) {
  let err = new TypeError('validation error');
  err.value = value;
  return err;
}

const any = {
  _allowed: [],
  _renameTo: null,
  _transforms: [],
  _valid: [],
  _validators: [],

  _duplicate(arrayName) {
    let duplicate = Object.create(this);

    // To help performance, take a copy-on-write approach
    // to copying over arrays. Only copy the array that is specified
    // as an input parameter.
    if (arrayName) {
      duplicate[arrayName] = [].concat(this[arrayName]);
    }

    return duplicate;
  },

  /**
   * Explicitly allow a value, before any conversion.
   * Accepts one or more arguments.
   *
   * @method allow
   * @param {variant} vals
   */
  allow(/*...vals*/) {
    let duplicate = this._duplicate('_allowed');
    [].push.apply(duplicate._allowed, arguments);
    return duplicate;
  },

  /**
   * Mark the field as optional. All fields are optional by default.
   *
   * @method optional
   */
  optional() {
    return this;
  },

  /**
   * Export the result as `name` in the results. If `name` is specified,
   * acts as a setter. If `name` is not specified, acts as a getter.
   *
   * @method renameTo
   * @param {string} [name] - if not specified, acts as a getter.
   * @returns {Schema} if acting as a setter, or
   *          {string} export name, only returned if acting as a getter.
   */
  renameTo(name) {
    if (arguments.length === 0) {
      return this._renameTo;
    }

    // no need to pass in an array name, none are being updated.
    let duplicate = this._duplicate();
    duplicate._renameTo = name;
    return duplicate;
  },

  /**
   * Mark the field as required
   *
   * @method required
   */
  required() {
    var duplicate = this._duplicate();
    duplicate._isRequired = true;
    return duplicate;
  },

  /**
   * Remove current transforms
   *
   * @method strict
   */
  strict() {
    // no need to pass in `_transforms` since it'll be overwritten anyways
    let duplicate = this._duplicate();
    duplicate._transforms = [];
    return duplicate;
  },

  /**
   * Add a validation test function. Function will
   * be called with value being validated.
   *
   * @method test
   * @param {function} validator
   */
  test(validator) {
    let duplicate = this._duplicate('_validators');
    duplicate._validators.push(validator);
    return duplicate;
  },

  /**
   * Add a transformer. A transformer is a function that accepts
   * a value and returns another value. Validation will occur
   * with the transformed value.
   *
   * @method transform
   * @param {function} transformer
   */
  transform(transformer) {
    let duplicate = this._duplicate('_transforms');
    duplicate._transforms.push(transformer);
    return duplicate;
  },

  /**
   * Create an exclusive allowed list of values.
   * Accepts one or more arguments.
   *
   * @method valid
   * @param {variant} ...vals
   */
  valid(/*...vals*/) {
    let duplicate = this._duplicate('_valid');
    [].push.apply(duplicate._valid, arguments);
    return duplicate;
  },

  /**
   * Validate a value
   *
   * @method validate
   * @param {variant} val
   * @returns {object} result
   * @returns {Error} [result.error] - Present if any validation errors occur.
   * @returns {variant} result.value - The transformed value. Present if
   * validation succeeds. Same as `val` if no transformation is made.
   */
  validate(val) {
    let origValue = val;

    // Perform any transformations.
    val = this._transforms.reduce((val, transform) => {
      return transform(val);
    }, val);

    // Check the exclusive allowed list first. If an exclusive allowed list
    // is defined and the value is not a member of list, throw
    // a validation error.
    if (this._valid.length) {
      if (_.contains(this._valid, val)) {
        return { value: val };
      } else if (! _.isUndefined(val)) {
        return { error: toValidationError(origValue) };
      }
    }

    // Check against the allowed list. If the value is not a member
    // of the allowed list, continue.
    if (_.contains(this._allowed, val)) {
      return { value: val };
    }

    // If an undefined value and field is optional, no
    // further validation is done.
    if (_.isUndefined(val)) {
      if (this._isRequired) {
        return { error: new ReferenceError('missing value') };
      } else {
        // If an undefined value and field is optional, no
        // further validation is done.
        return { value: val };
      }
    }

    // Finally, perform the validations.
    try {
      this._validators.forEach((validator) => {
        if (! validator(val)) {
          throw toValidationError(origValue);
        }
      });
    } catch (e) {
      return { error: e };
    }

    return { value: val };
  }
};

module.exports = () => {
  return any._duplicate();
};


