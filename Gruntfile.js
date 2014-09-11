module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		// Metadata.
		pkg      : grunt.file.readJSON('package.json'),
		banner   : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> @ <%= pkg.company.name%>' +
			' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
		// Task configuration.

		copy     : {
			main: {
				files: [
					{expand: true, flatten: true, src: ['src/breakpointlistener.js'], dest: 'dist/'}
				]
			}
		},

		uglify   : {
			options: {
				banner: '<%= banner %>'
			},
			dist   : {
				src : 'dist/breakpointlistener.js',
				dest: 'dist/breakpointlistener.min.js'
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task.
	grunt.registerTask('default', ['copy', 'uglify']);

};