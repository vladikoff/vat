"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function (f) {
  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }g.Validator = f();
  }
})(function () {
  var define, module, exports;return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
        }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
          var n = t[o][1][e];return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }return n[o].exports;
    }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
      s(r[o]);
    }return s;
  }({ 1: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global module */

      'use strict'; //jshint ignore:line

      module.exports = {
        contains: function contains(array, item) {
          return array.indexOf(item) !== -1;
        },
        extend: function extend(target /*, ...src*/) {
          var sources = [].slice.call(arguments, 1);
          sources.forEach(function (source) {
            for (var key in source) {
              target[key] = source[key];
            }
          });
          return target;
        },
        isBoolean: function isBoolean(val) {
          return Object.prototype.toString.call(val) === '[object Boolean]';
        },
        isFunction: function isFunction(val) {
          return typeof val === 'function';
        },
        isNumber: function isNumber(val) {
          return Object.prototype.toString.call(val) === '[object Number]';
        },
        isString: function isString(val) {
          return Object.prototype.toString.call(val) === '[object String]';
        },
        isUndefined: function isUndefined(val) {
          return typeof val === 'undefined';
        },
        union: function union() /*...arrays*/{
          var arrays = [].slice.call(arguments, 0);

          var union = [];
          arrays.forEach(function (array) {
            array.forEach(function (item) {
              if (!module.exports.contains(union, item)) {
                union.push(item);
              }
            });
          });

          return union;
        }
      };
    }, {}], 2: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      var _ = require('../ourscore');

      function toValidationError(value) {
        var err = new TypeError('validation error');
        err.value = value;
        return err;
      }

      var any = {
        _allowed: [],
        _transforms: [],
        _valid: [],
        _validators: [],

        _duplicate: function _duplicate(arrayName) {
          var duplicate = Object.create(this);

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
        allow: function allow(val) {
          var duplicate = this._duplicate('_allowed');
          duplicate._allowed.push(val);
          return duplicate;
        },


        /**
         * Export the result as {name} in the results.
         *
         * @method as
         * @param {string} name
         */
        as: function as(name) {
          if (arguments.length === 0) {
            return this._as;
          }

          // no need to pass in an array name, none are being updated.
          var duplicate = this._duplicate();
          duplicate._as = name;
          return duplicate;
        },


        /**
         * Mark the field as optional. All fields are optional by default.
         *
         * @method optional
         */
        optional: function optional() {
          return this;
        },


        /**
         * Mark the field as required
         *
         * @method required
         */
        required: function required() {
          var duplicate = this.test(function (val) {
            if (_.isUndefined(val)) {
              throw new ReferenceError('missing value');
            }
            return true;
          });

          duplicate._isRequired = true;
          return duplicate;
        },


        /**
         * Remove current transforms
         *
         * @method strict
         */
        strict: function strict() {
          // no need to pass in `_transforms` since it'll be overwritten anyways
          var duplicate = this._duplicate();
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
        test: function test(validator) {
          var duplicate = this._duplicate('_validators');
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
        transform: function transform(transformer) {
          var duplicate = this._duplicate('_transforms');
          duplicate._transforms.push(transformer);
          return duplicate;
        },


        /**
         * Create an exclusive allowed list of values.
         *
         * @method valid
         * @param {variant} val
         */
        valid: function valid(val) {
          var duplicate = this._duplicate('_valid');
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
        validate: function validate(val) {
          var origValue = val;

          // Check the exclusive allowed list first. If an exclusive allowed list
          // is defined and the value is not a member of list, throw
          // a validation error.
          if (this._valid.length) {
            if (_.contains(this._valid, val)) {
              return val;
            } else if (!_.isUndefined(val)) {
              throw toValidationError(origValue);
            }
          }

          // Check against the allowed list. If the value is not a member
          // of the allowed list, continue.
          if (_.contains(this._allowed, val)) {
            return val;
          }

          // Perform any transformations.
          val = this._transforms.reduce(function (val, transform) {
            return transform(val);
          }, val);

          // If an undefined value and field is optional, no
          // further validation is done.
          if (_.isUndefined(val) && !this._isRequired) {
            return val;
          }

          // Finally, perform the validations.
          this._validators.forEach(function (validator) {
            if (!validator(val)) {
              throw toValidationError(origValue);
            }
          });

          return val;
        }
      };

      module.exports = function () {
        return any._duplicate();
      };
    }, { "../ourscore": 1 }], 3: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      var _ = require('../ourscore');

      module.exports = function (createValidator) {
        var validator = createValidator();

        return validator.transform(function (val) {
          if (val === 'true') {
            return true;
          }if (val === 'false') {
            return false;
          }

          return val;
        }).test(function (val) {
          return _.isBoolean(val) || _.isUndefined(val);
        });
      };
    }, { "../ourscore": 1 }], 4: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      var _ = require('../ourscore');

      module.exports = function (createValidator) {
        var validator = createValidator();

        return validator.transform(function (val) {
          if (!_.isNumber(val)) {
            if (/^\d+$/.test(val)) {
              return parseInt(val, 10);
            } else if (/^\d*\.\d*$/.test(val)) {
              return parseFloat(val);
            }
          }

          return val;
        }).test(function (val) {
          return _.isNumber(val) || _.isUndefined(val);
        });
      };
    }, { "../ourscore": 1 }], 5: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      var _ = require('../ourscore');

      var string = {
        /**
         * Specifies the exact string length required
         *
         * @method len
         * @param {number} limit
         */

        len: function len(limit) {
          return this.test(function (val) {
            return val.length === limit;
          });
        },


        /**
         * Specifies the maximum number of characters
         *
         * @method max
         * @param {number} limit
         */
        max: function max(limit) {
          return this.test(function (val) {
            return val.length <= limit;
          });
        },


        /**
         * Specifies the minimum number of characters
         *
         * @method min
         * @param {number} limit
         */
        min: function min(limit) {
          return this.test(function (val) {
            return val.length >= limit;
          });
        }
      };

      module.exports = function (createValidator) {
        var validator = createValidator();
        _.extend(validator, string);

        return validator.transform(function (val) {
          // trim strings by default
          if (_.isString(val)) {
            return val.trim();
          }

          return val;
        }).test(function (val) {
          return _.isString(val) || _.isUndefined(val);
        });
      };
    }, { "../ourscore": 1 }], 6: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      var _ = require('./ourscore');

      function validate(data, schema) {
        var error = null;
        var value = data;

        try {
          if (_.isUndefined(schema)) {
            var missingSchemaError = new Error('missing schema');
            missingSchemaError.value = data;
            throw missingSchemaError;
          }

          if (_.isFunction(schema.validate)) {
            // validate function should return converted values
            value = schema.validate(data);
          } else {
            // use the union to ensure all possible data has
            // a corresponding schema item and all possible schema
            // items have been checked.
            var allKeys = _.union(Object.keys(data), Object.keys(schema));
            value = {};
            allKeys.forEach(function (key) {
              var result = validate(data[key], schema[key]);

              if (result.error) {
                result.error.key = key;
                throw result.error;
              }

              var targetKey = schema[key].as() || key;
              // only add undefined values iff the value is required
              if (!_.isUndefined(result.value) || schema[key]._isRequired) {
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
        register: register,
        unregister: unregister,
        validate: validate
      };

      var reserved = Object.keys(module.exports);
      var types = {};

      function register(typeName, schema) {
        if (_.contains(reserved, typeName)) {
          throw new Error("'" + typeName + "' is reserved");
        }

        if (types[typeName]) {
          throw new Error("'" + typeName + "' is already registered");
        }

        module.exports[typeName] = types[typeName] = function () {
          return schema;
        };
      }

      function unregister(typeName) {
        if (_.contains(reserved, typeName)) {
          throw new Error("'" + typeName + "' is reserved");
        }

        if (!types[typeName]) {
          throw new Error("'" + typeName + "' is already not registered");
        }

        delete module.exports[typeName];
        delete types[typeName];
      }

      var any = require('./types/any');

      register('any', any());
      register('boolean', require('./types/boolean')(any));
      register('number', require('./types/number')(any));
      register('string', require('./types/string')(any));
    }, { "./ourscore": 1, "./types/any": 2, "./types/boolean": 3, "./types/number": 4, "./types/string": 5 }] }, {}, [6])(6);
});
//# sourceMappingURL=validator.js.map
