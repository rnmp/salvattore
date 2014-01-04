module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
         'src/polyfills/matchMedia.js',
         'src/polyfills/matchMedia.addListener.js',
         'src/polyfills/requestAnimationFrame.js',
         'src/*.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*\n' +
                ' * Salvattore <%= pkg.version %> by @rnmp and @ppold\n' +
                ' * <%= pkg.repository.url %>\n' +
                ' */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js'],
      options: {
        laxcomma: true,
        strict: true
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    umd: {
      all: {
        src: '<%= concat.dist.dest %>',
        amdModuleId: '<%= pkg.name %>',
        objectToExport: '<%= pkg.name %>',
        globalAlias: '<%= pkg.name %>'
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('test', ['jshint']);

  grunt.registerTask('default', ['jshint', 'concat', 'umd', 'uglify']);

};
