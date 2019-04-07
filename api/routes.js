
let stats = require("../modules/stats");

module.exports = {
    init: function (app) {
        app.get('/api/stats', (req, res) => {
            console.log("[API:GET:STATS] Get stats".event)
            stats.get().then((stat)=>{
                res.json(stat);
            });
        });
    }
};