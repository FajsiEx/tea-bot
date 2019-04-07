const routes = require("./routes.js");

module.exports = {
    init: function(app) {
        routes.init(app);

        let port = process.env.PORT || 3210;

        app.listen(port, function () {
            console.log(("[API_SERVER] Listening. Port [" + port + "]").success);
        });
    }
};