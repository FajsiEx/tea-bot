const request = require("request");
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
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
                "color": COLORS.BLUE
            }
        }).then((sentMsg)=>{
            request({
                url: "https://custom-r34-api.herokuapp.com/posts?tags=" + tagsParam,
                json: true
            }, (err, res, data)=>{
                if (!err && res.statusCode == 200) {
                    console.log("R34".debug);
                    console.dir(data);
                
                    if (data.length == 0) {
                        msg.channel.send({
                            "embed": {
                                "title": "Not found",
                                "color": COLORS.RED,
                                "description": "**No posts were found under tags: **" + tags.join(",")
                            }
                        }).then(()=>{
                            sentMsg.delete();
                        });
                        return;
                    }
                
                    let post = data[Math.floor(Math.random() * data.length)];
                
                    
                    msg.channel.send({
                        "embed": {
                            "title": "r34",
                            "color": COLORS.GREEN,
                            "description": `
                                **Score: **${post.score}
                                **Res: **${post.width}x${post.height}
                                **Tags: **${JSON.stringify(post.tags)}
                            `
                        },
                        "files": [post.file_url]
                    }).then(()=>{
                        sentMsg.delete();
                    });
                }else{
                    msg.channel.send({
                        "embed": {
                            "title": "Error",
                            "color": COLORS.RED,
                            "description": "Could not get the post. ERR:" + res.statusCode
                        }
                    }).then(()=>{
                        sentMsg.delete();
                    });
                }
            });
        });
    }
}