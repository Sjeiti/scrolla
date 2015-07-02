/* global module, require */
module.exports = function (grunt) {
	'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		// watch
		,watch: {
			options: { spawn: false, livereload: true }//, livereload: 35729
			,gruntfile: {
				files: ['Gruntfile.js', '.jshintrc', 'gruntTasks/**']
				,options: { reload: true }
			}
			,js: {
				files: ['src/*.js','.jshintrc','.jscsrc']
				,tasks: ['js']
			}
		}

		// JSHint the source files
		,jshint: {
			options: { jshintrc: '.jshintrc' }
			,files: ['src/scrolla.js']
		}

		// Check source code style
		,jscs: {
			src: 'src/scrolla.js', options: { config: ".jscsrc" }
		}

		// Clean folders
		,clean: {
			dist: {
				src: ['dist/**']
			}
		}

		// Uglify all the things
		,uglify: {
			main: {
				options: {
					sourceMap: true
					,wrap: true
					,mangle: true
					// below not working ???
					//mangleProperties: true
					//,reserveDOMProperties: true
					//,exceptionsFiles: ['uglify-reserved.json']
				}
				,src: 'src/scrolla.js'
				,dest: 'dist/scrolla.min.js'
			}
			,gzip: {
				options: {
					compress: true
				}
				,src: 'src/scrolla.js'
				,dest: 'dist/scrolla.jgz'
			}
		}

		// versioning
		,version_git: {
			main: {
				src: [
					'src/scrolla.js'
					,'package.json'
					,'bower.json'
				]
			}
		}
	});

	grunt.registerTask('default',['watch']);

	grunt.registerTask('js',[
		'jshint'
		,'jscs'
		,'uglify'
	]);

	grunt.registerTask('version',[
		'version_git'
		,'js'
	]);
};