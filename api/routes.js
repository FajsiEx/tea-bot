
let stats = require("../modules/stats");
let dClient;

module.exports = {
    init: function (app, dClientRef) {
        dClient = dClientRef;

        app.get('/api/stats', (req, res) => {
            console.log("[API:GET:STATS] Get stats".event);
            stats.get().then((stat)=>{
                res.json(stat);
            });
        });
        app.post('/api/getTeaBotGuilds', (req, res) => {
            console.log("[API:GET:GET_TB_GUILDS] Get tea bot guilds".event);
            console.log(req.body);
            if (!req.body) {res.send("inv_arg_guilds");}

            let teaBotGuilds = [];

            req.body.forEach(guildId => {
                let serverGuild = dClient.guilds.find((guild)=>{
                    return guild.id == guildId;
                });
                if (serverGuild) {
                    teaBotGuilds.push(serverGuild);
                }
            });

            res.json({
                status: "ok",
                data: teaBotGuilds
            });
            
        });
    }
};