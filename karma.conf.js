'use strict';

module.exports = function (config) {
  config.set({
    frameworks: [
      'mocha',
      'expect',
      'fixture'
    ],

    files: [
      'dist/salvattore.js',
      'tests/salvattore.test.js',
      {
        pattern: 'tests/*.html'
      }
    ],

    reporters: ['mocha'],

    preprocessors: {
      'tests/*.html': ['html2js']
    }
  });
};
