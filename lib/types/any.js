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

const any = {
  _allowed: [],
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
   * Explicitly allow a value, before any conversion
   *
   * @method allow
   * @param {variant} val
   */
  allow(val) {
    let duplicate = this._duplicate('_allowed');
    duplicate._allowed.push(val);
    return duplicate;
  },

  /**
   * Export the result as {name} in the results.
   *
   * @method as
   * @param {string} name
   */
  as(name) {
    if (arguments.length === 0) {
      return this._as;
    }

    // no need to pass in an array name, none are being updated.
    let duplicate = this._duplicate();
    duplicate._as = name;
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
   * with returned value.
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
   *
   * @method valid
   * @param {variant} val
   */
  valid(val) {
    let duplicate = this._duplicate('_valid');
    duplicate._valid.push(val);
    return duplicate;
  },

  /**
   * Validate a value
   *
   * @method validate
   * @param {variant} val
   * @returns {variant} transformed value. The same as `val` if no
   * transformations made.
   * @throws TypeError if validation fails
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
        return val;
      } else if (! _.isUndefined(val)) {
        throw toValidationError(origValue);
      }
    }

    // Check against the allowed list. If the value is not a member
    // of the allowed list, continue.
    if (_.contains(this._allowed, val)) {
      return val;
    }

    // If an undefined value and field is optional, no
    // further validation is done.
    if (_.isUndefined(val)) {
      if (this._isRequired) {
        throw new ReferenceError('missing value');
      } else {
        // If an undefined value and field is optional, no
        // further validation is done.
        return val;
      }
    }

    // Finally, perform the validations.
    this._validators.forEach((validator) => {
      if (! validator(val)) {
        throw toValidationError(origValue);
      }
    });

    return val;
  }
};

module.exports = () => {
  return any._duplicate();
};


