module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    Pkg: grunt.file.readJSON('package.json'),
    srcfiles: ['js'],
    uglify: {
      options: {
        mangle: false
      },
      build: {
        src: '<%= srcfiles %>',
        dest: 'build/app.min.js'
      }
    },
    jshint: {
      all: [
        'js/app/**/*.js',
        'js/enmarcha/**/*.js'
      ],
      options: {
        node: true,
        unused: false,
        jshintrc : '.jshintrc'
      }
    },
    sass: {
      dist: {
          options: {
              style: 'expanded'
          },
          files: {
              'css/app.css': 'scss/app.scss'
          }
      }
    },
    watch: {
      scripts: {
        files: '<%= srcfiles %>',
        tasks: ['uglify'],//['default'],
        options: {
          spawn: false
        }
      },
      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify']);

};

