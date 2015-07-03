/* global module, require */
module.exports = function (grunt) {
	'use strict';

    require('load-grunt-tasks')(grunt);
	grunt.loadTasks('gruntTasks');
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

		,copy: {
			src2dist: {
				files: [
					{
						expand: true
						,cwd: './src/'
						,src: ['scrolla.js']
						,dest: 'dist/'
						,filter: 'isFile'
						,dot: true
					}
				]
			}
			,dist2doc: {
				files: [
					{
						expand: true
						,cwd: './'
						,src: ['dist/**']
						,dest: 'doc/'
						,filter: 'isFile'
						,dot: true
					}
				]
			}
		}

		,clean: {
			dist:	{ src: ['dist/**'] }
			,jsdoc:	{ src: ['doc/**'] }
			,temp:	{ src: ['temp/**'] }
		}

		// command line interface
		,cli: {
			jsdoc: { cwd: './', command: '"node_modules/.bin/jsdoc" -c jsdoc.json', output: true }
			,jsdocprepare: { cwd: './jsdoc', command: 'grunt prepare', output: true }
			,jsdocInitNpm: { cwd: './jsdoc', command: 'npm install', output: true }
			,jsdocInitBower: { cwd: './jsdoc', command: 'bower install', output: true }
			,selenium: { cwd: './bin', command: 'java -jar selenium-server-standalone-2.44.0.jar', output: true }
		}

		// uses Phantomjs to render pages and inject a js file
		,renderPages: {
			docs: {
				baseUri: 'doc/'
				,dest: './temp/'
				,destType: 'json'
				,pages: ['scrolla.html']
				,inject: 'src-dev/js/phantomRenderDocs.js'
				,renderImage: false
			}
		}

		// extend the rendered jsdoc files with data
		,extendDocs: {
			main: {
				src: './doc/index.html'
				,dest: './doc/index.html'
				,json: './temp/scrolla.json'
			}
		}

		,extendMarkdown: {
			main:{
				src: './jsdoc/main.md'
				,dest: './README.md'
				,json: './temp/scrolla.json'
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

	grunt.registerTask('dist',[
		'js'
		,'copy:src2dist'
	]);

	grunt.registerTask('doc',[
		'clean:jsdoc'
		,'cli:jsdocprepare'
		,'cli:jsdoc'
		,'copy:dist2doc'
	]);

	grunt.registerTask('jsdoc',[
		'clean:jsdoc'
		,'cli:jsdocprepare'
		,'cli:jsdoc'
		,'copy:dist2doc'
		,'renderPages:docs'
		,'extendDocs'
		,'extendMarkdown'
	]);
};