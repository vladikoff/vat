/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

module.exports = function (grunt) {
  'use strict';

  grunt.config('webpack', {
    dist: {
      // webpack options
      entry: './lib/validator.js',
      output: {
        path: ".tmp/",
        filename: "validator.js",
      },

      stats: {
        // Configure the console output
        colors: false,
        modules: true,
        reasons: true
      },
      // stats: false disables the stats output

      storeStatsTo: "xyz", // writes the status to a variable named xyz
      // you may use it later in grunt i.e. <%= xyz.hash %>

      progress: false, // Don't show progress
      // Defaults to true

      failOnError: false, // don't report error to grunt if webpack find errors
      // Use this if webpack errors are tolerable and grunt should continue

      watch: false, // use webpacks watcher
      // You need to keep the grunt process alive

      keepalive: false, // don't finish the grunt task
      // Use this in combination with the watch option

      inline: true,  // embed the webpack-dev-server runtime into the bundle
      // Defaults to false

      hot: true, // adds the HotModuleReplacementPlugin and switch the server to hot mode
      // Use this in combination with the inline option
    },
  });
};
