const imageDownload = require("image-downloader");
const fs = require("fs");
const jimp = require("jimp");

module.exports = {
    handler: async function (messageEventData) {
        let msg = messageEventData.msg;

        let commandLength = msg.content.split(" ")[0].length + 1;
        let text = msg.content.slice(commandLength);

        let fileName;

        try {
            let image = await imageDownload.image({
                url: "https://preview.redd.it/a4jogwm2p2631.png?width=1024&auto=webp&s=7f0bf0e7dc18a8a06c9f847459537280b44e1840",
                dest: "./"
            });

            fileName = image.filename;
        }catch(e) {
            throw("Failed to download template: " + e);
        }

        let image;
        try {
            let image = await jimp.read(fileName);

            let font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
            let fontCanvas = await jimp.create(1024, 576);
            
            await fontCanvas.print(font, 150, 80, text, 200).rotate(-12);
            
            image.blit(fontCanvas, 0, 0).write(fileName);
        }catch(e) {
            throw("Failed to modify image: " + e);
        }

        try {
            await msg.channel.send({files: [fileName]});
        }catch(e){
            throw("Failed to send response: " + e);
        }

        try {
            await fs.unlink(fileName, ()=>{});
        }catch(e){
            console.warn(e);
        }


    }
};