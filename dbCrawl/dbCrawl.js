require('shelljs/global');

var arg = process.argv.slice(2);

var commands = { //write custom commands here
  findUndef : "'{ $or: [ {itunes_id: null}, {spotify_id: null}, {youtube_id: null} ] }'"
}

function crawl (arg) {

  exec("mongoexport --db songlink --collection songs --query "+
    arg + " --out dbCrawlLog.csv --type=csv --fields 'hash_id,title,artist,album_title,youtube_id,spotify_id,itunes_id'", {async:true});

}
if (commands[arg[0]]) {
  crawl(commands[arg[0]]);
}