/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = (toValidator) => {
  return () => {
    var validator = toValidator('[object Boolean]');

    validator.strict = function () {
      this._convert = null;
      return this;
    };

    validator._convert = function (val) {
      if (val === 'true') {
        return true;
      } if (val === 'false') {
        return false;
      }

      return val;
    };

    return validator;
  };
};

