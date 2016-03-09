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

      /*global exports*/

      'use strict'; //jshint ignore:line

      exports.isFunction = function (val) {
        return typeof val === 'function';
      };

      exports.isString = function (val) {
        return Object.prototype.toString.call(val) === '[object String]';
      };

      exports.isUndefined = function (val) {
        return typeof val === 'undefined';
      };

      exports.contains = function (array, item) {
        return array.indexOf(item) !== -1;
      };

      exports.union = function () /*...arrays*/{
        var arrays = [].slice.call(arguments, 0);

        var union = [];
        arrays.forEach(function (array) {
          array.forEach(function (item) {
            if (!exports.contains(union, item)) {
              union.push(item);
            }
          });
        });

        return union;
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

      module.exports = function () {
        var validator = function validator(val) {
          var origValue = val;

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
            val = validator._transforms.reduce(function (val, converter) {
              return converter(val);
            }, val);
          }

          if (validator._validators) {
            validator._validators.forEach(function (validator) {
              if (!validator(val)) {
                throw toValidationError(origValue);
              }
            });
          }

          return val;
        };

        validator.allow = function (val) {
          if (!this._allowed) {
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
          if (!this._transforms) {
            this._transforms = [];
          }

          this._transforms.push(transformer);
          return this;
        };

        validator.use = function (validator) {
          if (!this._validators) {
            this._validators = [];
          }
          this._validators.push(validator);
          return this;
        };

        validator.valid = function (val) {
          if (!this._valid) {
            this._valid = [];
          }

          this._valid.push(val);
          return this;
        };

        return validator;
      };
    }, { "../ourscore": 1 }], 3: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      module.exports = function (createValidator) {
        return function () {
          var validator = createValidator();

          validator.transform(function (val) {
            if (val === 'true') {
              return true;
            }if (val === 'false') {
              return false;
            }

            return val;
          }).use(function (val) {
            var actualType = Object.prototype.toString.call(val);
            return actualType === '[object Boolean]';
          });

          return validator;
        };
      };
    }, {}], 4: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      module.exports = function (createValidator) {
        return function () {
          var validator = createValidator();

          validator.transform(function (val) {
            var actualType = Object.prototype.toString.call(val);
            if (actualType !== '[object Number]') {
              if (/^\d+$/.test(val)) {
                return parseInt(val, 10);
              } else if (/^\d*\.\d*$/.test(val)) {
                return parseFloat(val);
              }
            }

            return val;
          }).use(function (val) {
            var actualType = Object.prototype.toString.call(val);
            return actualType === '[object Number]';
          });

          return validator;
        };
      };
    }, {}], 5: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      var _ = require('../ourscore');

      module.exports = function (createValidator) {
        return function () {
          var validator = createValidator();

          validator.transform(function (val) {
            // trim strings by default
            if (_.isString(val)) {
              return val.trim();
            }

            return val;
          }).use(function (val) {
            return _.isString(val);
          });

          /**
           * Specifies the exact string length required
           *
           * @param {number} limit
           */
          validator.len = function (limit) {
            validator.use(function (val) {
              return val.length === limit;
            });

            return validator;
          };

          /**
           * Specifies the maximum number of characters
           *
           * @param {number} limit
           */
          validator.max = function (limit) {
            validator.use(function (val) {
              return val.length <= limit;
            });

            return validator;
          };

          /**
           * Specifies the minimum number of characters
           *
           * @param {number} limit
           */
          validator.min = function (limit) {
            validator.use(function (val) {
              return val.length >= limit;
            });

            return validator;
          };

          return validator;
        };
      };
    }, { "../ourscore": 1 }], 6: [function (require, module, exports) {
      /* This Source Code Form is subject to the terms of the Mozilla Public
       * License, v. 2.0. If a copy of the MPL was not distributed with this
       * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

      /*global require, module*/

      'use strict'; //jshint ignore:line

      var _ = require('./ourscore');

      var any = require('./types/any');
      var boolean = require('./types/boolean')(any);
      var number = require('./types/number')(any);
      var string = require('./types/string')(any);

      function validate(data, schema) {
        var error = null;
        var value = data;

        try {
          if (_.isUndefined(schema)) {
            var missingSchemaError = new Error('missing schema');
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
            var allKeys = _.union(Object.keys(data), Object.keys(schema));
            value = {};
            allKeys.forEach(function (key) {
              var result = validate(data[key], schema[key]);

              if (result.error) {
                result.error.key = key;
                throw result.error;
              }

              var targetKey = schema[key].as() || key;
              // only add undefined values iff the value is not optional
              if (!_.isUndefined(result.value) || !schema[key]._isOptional) {
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
        any: any,
        boolean: boolean,
        number: number,
        string: string,
        validate: validate
      };
    }, { "./ourscore": 1, "./types/any": 2, "./types/boolean": 3, "./types/number": 4, "./types/string": 5 }] }, {}, [6])(6);
});
//# sourceMappingURL=validator.js.map
