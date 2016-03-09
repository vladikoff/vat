/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (grunt) {
  'use strict';

  grunt.config('bump', {
    options: {
      commit: true,
      commitFiles: ['-a'],
      commitMessage: 'source-%VERSION%',
      createTag: true,
      files: ['package.json'],
      push: true,
      pushTo: 'git@github.com:shane-tomlinson/vat.git master',
      tagMessage: 'Version %VERSION%',
      tagName: 'source-%VERSION%',
      updateConfigs: ['pkg']
    }
  });
};
