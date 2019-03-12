const request = require("request");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        /*
        request.post({
            url: "https://spseadlerka.edupage.org/substitution/server/viewer.js",
            body: {
                __func: "getSubstViewerDayDataHtml",
                __args: [null, {date: "2019-02-13", type: "classes"}],
                __gsh: "2712c3fb"
            },
            json: true
        }, (err, res, data)=>{
            if (!err && res.statusCode == 200) {
                console.log(data);
            }else{
                console.error(err);
            }
        });
        */

        
        request({
            url: "https://spseadlerka.edupage.org/substitution/",
        }, (err, res, data)=>{
            if (!err && res.statusCode == 200) {
                console.log("SUB DEBUG".debug);
                console.dir(data);

                let htmlDoc = new JSDOM(data).window.document;
                console.dir(htmlDoc);
                //('#kids_middle_container > div > div > div.skinTemplateMainDiv > div > div:nth-child(4) > div > div:nth-child(6) > div > div:nth-child(2) > div:nth-child(1) > span')
                let todaySub = {
                    day: htmlDoc.querySelector('#kids_middle_container > div > div > div.skinTemplateMainDiv > div > div:nth-child(4) > div > div:nth-child(3)').innerHTML.split("-")[1],
                    teachers: htmlDoc.querySelector('#kids_middle_container > div > div > div.skinTemplateMainDiv > div > div:nth-child(4) > div > div:nth-child(6) > div > div:nth-child(2) > div:nth-child(1) > span').innerHTML.split(":")[1]
                }

                let tomorrowButton = htmlDoc.querySelector('#kids_middle_container > div > div > div.skinTemplateMainDiv > div > div:nth-child(4) > div > div.SubstViewDateSwitcher > div.switcher > div:nth-child(10)');
                tomorrowButton.click();

                /*let tomorrowSub = {
                    day: htmlDoc.querySelector('#kids_middle_container > div > div > div.skinTemplateMainDiv > div > div:nth-child(4) > div > div:nth-child(3)').innerHTML.split("-")[1],
                    teachers: htmlDoc.querySelector('#kids_middle_container > div > div > div.skinTemplateMainDiv > div > div:nth-child(4) > div > div:nth-child(6) > div > div:nth-child(2) > div:nth-child(1) > span').innerHTML.split(":")[1]
                }*/

                msg.channel.send({
                    "embed": {
                        "title": "Sub",
                        "color": COLORS.GREEN,
                        "description": `
                            **${todaySub.day}**
                            **Missing teachers:** ${todaySub.teachers}
                        `,
                        "footer": {
                            "text": "Sub command is in [BETA] (not finished yet.)"
                        }
                    }
                })
            }else{
                msg.channel.send({
                    "embed": {
                        "title": "Error",
                        "color": COLORS.RED,
                        "description": "Could not get shit. ERR:" + res.statusCode
                    }
                })
            }
        });
        
    }
}