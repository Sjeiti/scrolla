/* global module, require */
/* jshint strict: false */
module.exports = function (grunt) {
	//
    // Load grunt tasks automatically
	require('load-grunt-tasks')(grunt, {pattern: ['grunt-*','!grunt-lib-phantomjs']});
	grunt.loadTasks('gruntTasks');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		// clean
		,clean: {
			static: {
				src: ['template/static/**']
			}
		}

        // inject Bower components into HTML
		,bower: {
			main: {
				json: 'bower.json'
				,bowerrc: '.bowerrc'
				,prefix: ''
				,dest: ['template/tmpl/layout.tmpl']
			}
		}

        // inject Bower components into HTML
		,bowerCopy: {
			main: {
				json: 'bower.json'
				,bowerrc: '.bowerrc'
				,dest: 'template/static'
			}
		}

        // concatenate Bower components to single file
		,bowerConcat: {
			main: {
				json: 'bower.json'
				,bowerrc: '.bowerrc'
				,dest: 'temp/vendor.concat.js'
			}
		}

		// copy all the stuff
		,copy: {
			js: {
				files: [
					{
						expand: true
						,cwd: 'src/js/'
						,src: ['*']
						,dest: 'template/static/scripts/'
						,filter: 'isFile'
						,dot: true
					}
				]
			}
			,html: {
				files: [
					{
						expand: true
						,cwd: 'src/'
						,src: ['*.html']
						,dest: 'template/static/'
						,filter: 'isFile'
						,dot: true
					}
				]
			}
		}

		// concatenate and minify
		,uglify: {
			src: {
				options: { banner: '' }
				,src: 'src/js/*.js'
				,dest: 'template/static/scripts/main.min.js'
			}
		}

		// compile less
		,less: {
			options: {
				compress: true
			}
			,src: {
				src: ['src/style/site.sjeiti.less']
				,dest: 'template/static/styles/site.sjeiti.css'
			}
		}

	});

	grunt.registerTask('default',['js']);
	grunt.registerTask('js',[
		'copy:js'
	]);
	grunt.registerTask('bw',[
		'bower'
		,'bowerCopy'
	]);
	grunt.registerTask('prepare',[
		'less'
		,'js'
		,'bw'
		,'uglify:src'
		,'copy:html'
	]);
};