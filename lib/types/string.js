/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = (toValidator) => {
  return () => {
    var validator = toValidator('[object String]');

    validator.use = function (_validator) {
      this._validator = _validator;
      return validator;
    };

    return validator;
  };
};
