
const COLORS = require("../../consts").COLORS;
const OWM_API_KEY = process.env.OWMAPI;

let request = require("request");

module.exports = {
    command: function(msg) {
        let city = msg.content.slice(msg.content.indexOf(msg.content.split(" ", 2)[0]) + msg.content.split(" ", 2)[0].length + 1);

        request.get({
            "method" : "GET",
            "uri": `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=sk&appid=${OWM_API_KEY}`,
            "followRedirect":false,
            "headers": {
                'User-Agent': 'Tea-bot/1.1'
            }
        }, function(err, res, body) {
            console.log("[WEATHER_COMMAND] DEBUG: res_c:" + body);
            c_body = JSON.parse(body);

            request.get({
                "method" : "GET",
                "uri": `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=sk&appid=${OWM_API_KEY}`,
                "followRedirect":false,
                "headers": {
                    'User-Agent': 'Tea-bot/1.1'
                }
            }, function(err, res, body) {
                console.log("[WEATHER_COMMAND] DEBUG: res_f:" + body);
                f_body = JSON.parse(body);
                f_body.list.splice(7);
                forecast = f_body.list;

                forecastString = "";

                forecast.forEach((e)=>{
                    hour = e.dt_txt.split(" ")[1].split(":")[0] + "h";
                    temp = `**${e.main.temp}**°C`;
                    desc = e.weather[0].description;

                    forecastString += `${hour} ${temp} ${desc}\n`;
                })

                msg.channel.send({
                    "embed": {
                        "title": "Počasie pre **" + city + "**",
                        "color": COLORS.BLUE,
                        "thumbnail": {
                            "url": "https://openweathermap.org/img/w/" + c_body.weather[0].icon + ".png"
                        },
                        "description": `
                            **${c_body.main.temp}**°C a ${c_body.weather[0].description}
                            Vlhkosť: **${c_body.main.humidity}**%
                            Tlak: **${c_body.main.pressure}** hPa
                            
                            ${forecastString}
                        `
                    }
                });
            });
        });        
    }
}