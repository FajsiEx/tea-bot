const routes = require("./routes.js");
const bodyParser = require("body-parser");
const cors = require("cors");

module.exports = {
    init: function (app, dClient) {
        app.use(bodyParser.json()); // to support JSON-encoded bodies
        app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
            extended: true
        }));
        app.use(cors());

        routes.init(app, dClient);

        let port = process.env.PORT || 3210;

        app.listen(port, function () {
            console.log(("[API_SERVER] Listening. Port [" + port + "]").success);
        });
    }
};