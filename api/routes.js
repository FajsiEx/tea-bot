
let stats = require("../modules/stats");
let commandData = require("../handlers/command/commandData");
let dClient;
let triggers = require("./triggers");

module.exports = {
    init: function (app, dClientRef) {
        dClient = dClientRef;

        app.get('/api/stats', (req, res) => {
            console.log("hi");
            stats.get().then((stat)=>{
                res.json(stat);
            });
        });
        app.post('/api/getTeaBotGuilds', (req, res) => {
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


        //* Triggers
        app.post('/api/triggers/send', async (req, res) => {
            if (!req.body) {res.send("inv_arg_guilds");}

            try {
                await triggers.incomingData(req.body);
            }catch(e){
                res.json({
                    status: "error",
                    data: e
                });
                return;
            }

            res.json({
                status: "ok"
            });
            return;
        });

        app.get('/api/getCommandList', (req, res) => {
            res.json({
                status: "ok",
                data: commandData.getCommandList()
            });
        });
    }
};