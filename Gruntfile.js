module.exports = function(grunt) {
	 
	grunt.initConfig({
        webpack: {
            main: {
            // webpack options
            entry: "./js/source/co-oc-matrix.js",
            output: {
                path: "./js/dist/",
                filename: "index.js",
            },
            stats: {
                // Configure the console output
                colors: false,
                modules: true,
                reasons: true
            },
            failOnError: false,
            }
        },
		
		 watch: {
             options: {
                 livereload: true
             },
            scripts: {
                files: ['js/source/*.js'],
                tasks: ["webpack"]
            },
             css: {
                 files: ['view/assets/sass/*.scss'],
                 tasks: ["sass"]
             }
        },

        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    './view/assets/css/style.css': './view/assets/sass/style.scss'
                }
            }
        }
	});
	 
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['sass']);
	grunt.registerTask('default', ['webpack']);
};