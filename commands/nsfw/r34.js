const request = require("request");

const CONFIG = require('../../modules/config');

// TODO: refactor this piece of shit code
module.exports.handler = async function (messageEventData) {
    const msg = messageEventData.msg;

    let commandMessageArray = msg.content.split(" ");
    let lOfCommand = commandMessageArray[0].length + 1;
    let tagsString = msg.content.slice(lOfCommand);

    let tags = tagsString.split(" ");
    let tagsParam = tags.join("+");

    console.log("https://custom-r34-api.herokuapp.com/posts?tags=" + tagsParam);

    msg.channel.send({
        "embed": {
            "title": "Loading...",
            "description": "Loading image from r34...this ***MAY*** take a **while**",
            "color": CONFIG.EMBED.COLORS.INFO
        }
    }).then((sentMsg) => {
        request({
            url: "https://custom-r34-api.herokuapp.com/posts?tags=" + tagsParam,
            json: true
        }, (err, res, data) => {
            if (!err && res.statusCode == 200) {
                console.log("R34");
                console.dir(data);

                if (data.posts.length == 0) {
                    msg.channel.send({
                        "embed": {
                            "title": "Not found",
                            "color": CONFIG.EMBED.COLORS.FAIL,
                            "description": "**No posts were found under tags: **" + tags.join(",")
                        }
                    }).then(() => {
                        sentMsg.delete();
                    });
                    return;
                }

                let post = data.posts[Math.floor(Math.random() * data.posts.length - 1)];
                
                msg.channel.send({
                    "embed": {
                        "title": "r34",
                        "color": CONFIG.EMBED.COLORS.SUCCESS,
                        "description": `
                                **Score: **${post.score}
                                **Res: **${post.width}x${post.height}
                                **Tags: **${post.tags.join(", ")}
                            `
                    },
                    "files": [post.file_url]
                }).then(() => {
                    sentMsg.delete();
                });
            } else {
                msg.channel.send({
                    "embed": {
                        "title": "Error",
                        "color": CONFIG.EMBED.COLORS.FAIL,
                        "description": "Could not get the post. ERR:" + res.statusCode
                    }
                }).then(() => {
                    sentMsg.delete();
                });
            }
        });
    });
};