
const request = require("request");
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        request({
            url: "https://www.reddit.com/r/me_irl/random/.json",
            json: true
        }, (err, res, data)=>{
            if (!err && res.statusCode == 200) {
                try{
                    msg.channel.send({
                        "files": [data[0].data.children[0].data.url]
                    });
                }catch(e){
                    console.error(e);
                    msg.channel.send({
                        "embed": {
                            "title": "Error",
                            "color": COLORS.RED,
                            "description": "Vyskytla sa chyba pri requestovaní random postu z redditu."
                        }
                    });
                }
            }else{
                msg.channel.send({
                    "embed": {
                        "title": "Error",
                        "color": COLORS.RED,
                        "description": "Vyskytla sa chyba pri requestovaní random postu z redditu."
                    }
                });
            }
        });
    }
}