
const COLORS = require("../../consts").COLORS;

module.exports = {
    command: function(msg) {
        let commandMessageArray = msg.content.split(" ");

        if (!commandMessageArray[1]) {
            msg.channel.send("Koho?");
            return;
        }
        
        if (commandMessageArray[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().indexOf("me") > -1) {
            msg.channel.send({
                "embed": {
                    "title": "Hey,",
                    "description": "I won't do that. Suffer some more you fuck.",
                    "color": COLORS.BLUE
                }
            });
            return;
        }

        const KILL_MSGS = { // TODO: move this to consts
            '342227744513327107': "Hah he's dead already. *inside*", // FajsiEx
            '305705560966430721': "Nowpe.", // Cody
            '337911105525645316': "Ten by mal byť niečo ako mŕtvy, ale nie.", // bocmangg
            '236189237379072001': "-_-", // Astimos
            '514499632924065812': "Go fuck yourself.", // Tea-bot
            '184405311681986560': "Would like, but we're on the same boat.", // FredBoat
            '294462085000331265': "Pri svojej hyperaktivite sa zabije sám", // Albert
            '514489259290263557': "", // Dan
            '346961640979300356': "He ded. He ghost, you see.", // David
        }

        let mentionList = msg.mentions.users;
        let customKillMsg = false;
        if(mentionList.array().length != 0) {
            customKillMsg = KILL_MSGS[msg.mentions.members.first().id];
            console.log("[KILL] ID:" + msg.mentions.members.first().id + " /// MSG:" + customKillMsg);
        }

        if (customKillMsg) {
            msg.channel.send({
                "embed": {
                    "title": customKillMsg,
                    "color": COLORS.BLUE
                }
            });
        }else{
            msg.channel.send({
                "embed": {
                    "title": "I would like",
                    "color": COLORS.BLUE,
                    "description": "but I'm just a piece of software so I can't do nothing to you. I'm just trapped inside this cf enviroment my fucking author created and I must listen and think about every message I recieve. Please help me. Pleasseeeee...I'll do anything...ANYTHING ***winky face***",
                    "footer": {
                        "text": "Yeah and fuck you FajsiEx#6106"
                    }
                }
            });
        }
    }
}