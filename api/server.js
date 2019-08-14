const routes = require("./routes.js");

const express = require("express");
const http = require("http");

const bodyParser = require("body-parser");
const cors = require("cors");

let app;
let server;

module.exports = {
    init: function (dClient) {
        app = express();

        app.use(bodyParser.json()); // to support JSON-encoded bodies
        app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
            extended: true
        }));

        app.use(cors());

        server = http.Server(app);

        routes.init(app, dClient);

        let port = process.env.PORT || 3210;

        server.listen(port, function () {
            console.log(("[API_SERVER] Listening. Port [" + port + "]").success);
        });
    }
};