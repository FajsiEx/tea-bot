const CONFIG = require("../../modules/config");

const outdent = require("outdent");
const fetch = require('node-fetch');
const htmlParser = require('node-html-parser');

module.exports = {
    handler: async function (handleData) {

        let msg = handleData.msg;

        let tempCont = await fetch("https://spseadlerka.edupage.org/substitution/server/viewer.js?__func=getSubstViewerDayDataHtml", {"credentials":"include","headers":{
            "Host": "spseadlerka.edupage.org",
            "Connection": "keep-alive",
            "Content-Length": 75,
            "Origin": "https://spseadlerka.edupage.org",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.80 Safari/537.36",
            "Accept":"*/*",
            "Accept-Language":"en-US,en;q=0.9",
            "Content-type":"application/json; charset=UTF-8",
            "Referrer":"https://spseadlerka.edupage.org/substitution/",
            "Cookie": "PHPSESSID=e87c3777f56ab84171ac669bd120aed8; hsid=25f2aa8a544afec02735208d750413e2ceb5f81d"

        },"referrer":"https://spseadlerka.edupage.org/substitution/","referrerPolicy":"no-referrer-when-downgrade","body":"{\"__args\":[null,{\"date\":\"2019-06-13\",\"mode\":\"classes\"}],\"__gsh\":\"4027fe5c\"}","method":"POST","mode":"cors"}).then((d)=>{return d.text()})

        let document = htmlParser.parse(JSON.parse(tempCont).r, "text/html");
        console.log(document);
        console.log(document.innerHTML);

        let subNote = document.querySelector("div div div span").innerHTML;
        let subNoteTitle = subNote.split(":")[0]
        let subNoteContent = (subNote.split(":")[1]) ? subNote.split(":")[1].split(",").join("\n") : "";

        let subSects = document.querySelectorAll(".section");
        console.log(subSects);

        let classSubString;
        subSects.forEach(section=>{
            let className = section.querySelector(".header span").innerHTML;
            if (className != "I.B") return;

            classSubString = `**${className}**\n`;
            
            let rows = section.querySelectorAll(".row");

            rows.forEach(row=>{
                let period = row.querySelector(".period span").innerHTML;
                let info = row.querySelector(".info span").innerHTML;

                classSubString += `${period} - ${info}\n\n`;
            });
        });

        try {
            await msg.channel.send({
                embed: {
                    title: "Edu | Substitution",
                    color: CONFIG.EMBED.COLORS.INFO,
                    description: outdent`
                        **${subNoteTitle}**
                        ${subNoteContent}

                        ${classSubString}
                    `,
                    footer: CONFIG.EMBED.FOOTER(handleData)
                }
            });
        } catch (e) {
            throw ("Could not send message: " + e);
        }
        return 0;
    }
};
