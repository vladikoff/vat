/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const fxaChangelog = require('fxa-conventional-changelog')();

module.exports = function (grunt) {
  'use strict';

  grunt.config('conventionalChangelog', {
    options: {
      changelogOpts: {
        warn: grunt.verbose.writeln
      },
      gitRawCommitsOpts: {
        from: 'source-<%= pkgReadOnly.version %>'
      },
      parserOpts: fxaChangelog.parserOpts,
      writerOpts: fxaChangelog.writerOpts
    },
    release: {
      src: 'CHANGELOG.md'
    }
  });
};
