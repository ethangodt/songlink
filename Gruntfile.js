module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      my_target: {
        files: {
          'dist/scripts/listenerTools-min.js': ['server/static/scripts/listenerTools.js'],
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'dist/styles/main-min.css': 'server/static/styles/main.css'
        }
      }
    },
    shell: {
      mongo: {
        command: "mongoexport --db songlink --collection songs --query \
        '{ $or: [ {itunes_id: null}, {spotify_id: null}, {youtube_id: null} ] }' \
        --out dbCrawlLog.csv --type=csv --fields 'hash_id,title,artist,album_title,youtube_id,spotify_id,itunes_id'"
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-shell');

  // Default task(s).
  grunt.registerTask('mini', ['uglify','cssmin']);
  grunt.registerTask('dbCrawl', ['shell:mongo']);

};