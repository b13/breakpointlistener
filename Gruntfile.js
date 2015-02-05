config = {
	testCodeDirectory: __dirname + '/test/',
	testServerPath: 'test/server/server.coffee',
	testServerPort: 7777
}

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg   : grunt.file.readJSON('package.json'),
		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
		'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
		'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
		'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> @ <%= pkg.company.name%>' +
		' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.

		clean: {
			build: ['dist/*'],
			test : ['test/js/test.js','test/js/contrib/*','test/css/*']
		},

		concat : {
			test   : {
				src : ['test/js/test.js', 'test/js/testApp.js' ],
				dest: 'test/js/test.js'
			}
		},

		copy: {
			release: {
				files: [{expand: true, flatten: true, src: ['src/breakpointlistener.js'], dest: 'dist/'}]
			},
			test: {
				files: [
					{expand: true, flatten: true, src: ['bower_components/bowser/bowser.js'], dest: 'test/js/contrib/'},
					{expand: true, flatten: true, src: ['bower_components/requirejs/require.js'], dest: 'test/js/contrib/'},
					{expand: true, flatten: true, src: ['src/breakpointlistener.js'], dest: 'test/js/contrib/'}
				]
			}
		},

		concurrent: {
			dev: {
				tasks  : ['nodemon:dev', 'watch:dev'],
				options: {logConcurrentOutput: true}
			}
		},

		less: {
			test: {
				options: {
					compress      : false,
					yuicompress : false,
					cleancss    : false,
					optimization: null
				},
				files: {
					"test/css/test.css": "test/less/test.less"
				}
			}
		},

		nodemon: {
			dev: {
				script : 'test/server/server.coffee',
				options: {
					env  : {
						PORT     : config.testServerPort,
						DIRECTORY: config.testCodeDirectory
					},
					ignore: ['**']
				}
			}
		},

		requirejs: {
			test: {
				options: {
					name          : 'config'
					, mainConfigFile: 'test/js/config.js'
					, out           : 'test/js/test.js'
					, optimize      : 'none'
					, findNestedDependencies: true
				}
			}
		},

		uglify: {
			options: {
				banner: '<%= banner %>'
			},
			dist   : {
				src : 'dist/breakpointlistener.js',
				dest: 'dist/breakpointlistener.min.js'
			}
		},

		watch : {
			dev: {
				files: ['src/**/*.js'],
				tasks: ['clean:test', 'copy:test']
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-bower-just-install');
	grunt.loadNpmTasks('grunt-bower-requirejs');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');

	// Default task.
	grunt.registerTask('release', ['copy:release', 'uglify']);

	grunt.registerTask('devBuild', ['clean:test', 'copy:test', 'less:test', 'requirejs:test', 'concat:test']);
	grunt.registerTask('dev', ['devBuild', 'concurrent:dev']);

};