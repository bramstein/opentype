var extend = require('extend');

module.exports = function (grunt) {
  var compilerOptions = {
    compilation_level: 'ADVANCED_OPTIMIZATIONS',
    warning_level: 'VERBOSE',
    summary_detail_level: 3,
    language_in: 'ECMASCRIPT5_STRICT',
    output_wrapper: '"(function(){%output%}());"'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build'],
    closurecompiler: {
      compile: {
        files: {
          'build/opentype.js': ['src/**/*.js', 'vendor/google/base.js', 'vendor/zlib/**/*.js']
        },
        options: extend({}, compilerOptions, {
          define: 'goog.DEBUG=false'
        })
      },
      debug: {
        files: {
          'build/opentype.debug.js': ['src/**/*.js', 'vendor/google/base.js', 'vendor/zlib/**/*.js']
        },
        options: extend({}, compilerOptions, {
          debug: true,
          formatting: ['PRETTY_PRINT', 'PRINT_INPUT_DELIMITER']
        })
      }
    }
  });

  grunt.loadNpmTasks('grunt-closurecompiler');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('compile', ['closurecompiler:compile']);
  grunt.registerTask('debug', ['closurecompiler:debug']);
  grunt.registerTask('default', ['compile']);
};
