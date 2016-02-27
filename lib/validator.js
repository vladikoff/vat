/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/*global require, module*/

'use strict'; //jshint ignore:line

const _ = require('underscore');

const any = require('./types/any');
const boolean = require('./types/boolean')(any);
const string = require('./types/string')(any);

function validate(data, schema) {
  let error = null;
  let value = data;

  try {
    if (_.isUndefined(schema)) {
      let missingSchemaError = new Error('missing schema');
      missingSchemaError.value = data;
      throw missingSchemaError;
    }

    if (_.isFunction(schema)) {
      // schema function should return converted values
      value = schema(data);
    } else {
      // use the union to ensure all possible data has
      // a corresponding schema item and all possible schema
      // items have been checked.
      let allKeys = _.union(_.keys(data), _.keys(schema));
      value = {};
      allKeys.forEach(function (key) {
        let result = validate(data[key], schema[key]);

        if (result.error) {
          result.error.key = key;
          throw result.error;
        }

        let targetKey = schema[key].as() || key;
        // only add undefined values iff the value is not optional
        if (! _.isUndefined(result.value) || ! schema[key]._isOptional) {
          value[targetKey] = result.value;
        }
      });
    }
  } catch (e) {
    error = e;
  }

  return {
    error: error,
    value: value
  };
}

module.exports = {
  boolean: boolean,
  string: string,
  validate: validate
};
