var child_process = require('child_process');
var child;

child = child_process.spawn("mongoexport --db songlink --collection songs --query "+
        "'{ $or: [ {itunes_id: null}, {spotify_id: null}, {youtube_id: null} ] }' "+
        "--out dbCrawlLog.csv --type=csv --fields 'hash_id,title,artist,album_title,youtube_id,spotify_id,itunes_id'"
        );

console.log(child);