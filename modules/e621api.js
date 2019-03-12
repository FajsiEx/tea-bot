var request = require("request");

function random(tags, rating, limit, callback) {
  request.get({
    "method" : "GET",
    "uri": "https://e621.net/post/index.json?tags=" + tags + "%20order:random+rating:" + rating +"&limit=" + limit,
    "followRedirect":false,
    "headers": {
      'User-Agent': 'E621APIWrapper/1.0 (by DarkmaneArweinydd on e621)'
    }
  },function (err, res, body) {
    console.log('[e621API] GET: Responded.');
    var post = JSON.parse(body);
    var blockedtags = new Set(['bestiality', 'human']);
    var ts = post[0]['tags'];
    var blocked = false;
    blockedtags.forEach(function (tag){
      if (ts.includes(tag)){
        blocked = true;
      }
    });
    if (blocked) {
      console.log('[e621API] BLOCKED: Let\'s try that again...');
      random(tags, rating, limit, callback);
    } else {
      console.log('[e621API] DONE: Calling callback.');
      callback(post);
    }
  });

}

module.exports = {
  random: random
}