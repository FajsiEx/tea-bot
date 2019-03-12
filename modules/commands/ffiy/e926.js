
const COLORS = require("../../consts").COLORS;
const e926api = require('../../e926api');

module.exports = {
    command: function(msg) {

        msg.channel.send({
            "embed": {
                "title": "Loading...",
                "description": "Loading image from e926...this ***MAY*** take a **while**",
                "color": COLORS.BLUE
            }
        }).then((sentMsg)=>{
            e926api.random("m/m", "E", 1, post => {
                msg.channel.send({
                    "embed": {
                        "title": "by " + post[0]['author'],
                        "description": "**Favs:** " + post[0].fav_count + "\n**Artists:** " + JSON.stringify(post[0].artist) + "\n**Tags:** " + JSON.stringify(post[0].tags),
                        "color": COLORS.GREEN
                    },
                    "files": [post[0]['file_url']]
                }).then(()=>{
                    sentMsg.delete();
                });
                console.log("[DEBUG] E926:" + JSON.stringify(post));
            });
        });
    }
}