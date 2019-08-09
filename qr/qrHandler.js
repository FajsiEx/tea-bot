const imageDownload = require("image-downloader");
const fs = require("fs");
const jimp = require("jimp");

const qrData = require("./qrData");

module.exports = {
    handler: async function (handleData) {
        // Additional check for non-standard property
        let usedCommand = handleData.usedCommand;

        if (!usedCommand) {
            throw ("Handle data does not have usedCommand");
        }

        let requestedResponse = qrData.filter(qr => { // Get command itself from the category by the command name entered.
            return qr.keywords.indexOf(usedCommand) > -1;
        })[0];

        if (!requestedResponse) {
            throw ("No response was found for parsed keyword: " + usedCommand);
        }

        let responseHandler;

        switch (requestedResponse.type) {
            case "plain":
                responseHandler = module.exports.responseHandlers.plain;
                break;
            case "random":
                responseHandler = module.exports.responseHandlers.random;
                break;
            case "file":
                responseHandler = module.exports.responseHandlers.file;
                break;
            case "insertable":
                responseHandler = module.exports.responseHandlers.insertable;
                break;
            default:
                throw ("Invalid type of qr. Idk what to do with it. Programmer drunk lol.");
        }

        try {
            await responseHandler(handleData, requestedResponse);
        } catch (e) {
            throw (`Response handler rejected: ${e}`);
        }

        return 0;
    }, // End of handler

    responseHandlers: {
        plain: async function (handleData, qr) {
            try {
                await handleData.msg.channel.send(qr.data);
            } catch (e) {
                throw ("Failed to send plain QR response: " + e);
            }
            return 0;
        },
        random: async function (handleData, qr) {
            try {
                await handleData.msg.channel.send(qr.data[Math.floor(Math.random() * 100 % qr.data.length)]); // TODO: clean up
            } catch (e) {
                throw ("Failed to send plain QR response: " + e);
            }
            return 0;
        },
        file: async function (handleData, qr) {
            try {
                await handleData.msg.channel.send({ files: [qr.data] });
            } catch (e) {
                throw ("Failed to send attach QR response: " + e);
            }
            return 0;
        },
        insertable: async function (messageEventData, qr) {
            let msg = messageEventData.msg;

            let commandLength = msg.content.split(" ")[0].length + 1;
            let text = msg.content.slice(commandLength);

            if (!text) {
                try {
                    await msg.channel.send("Hey, specify what it should say! `!command text text text` for example.");
                }catch(e){
                    throw("Failed to send response: " + e);
                }

                return;
            }

            let fileName;

            try {
                let image = await imageDownload.image({
                    url: qr.data.src,
                    dest: "./"
                });

                fileName = image.filename;
            } catch (e) {
                throw ("Failed to download template: " + e);
            }

            let image;
            try {
                let image = await jimp.read(fileName);

                let font = await jimp.loadFont(jimp[qr.data.font]);
                let fontCanvas = await jimp.create(qr.data.fontCanvasSize.x, qr.data.fontCanvasSize.y);

                await fontCanvas.print(font, qr.data.textPosition.x, qr.data.textPosition.y, text, qr.data.maxTextWidth).rotate(qr.data.textRotate);

                image.blit(fontCanvas, 0, 0).write(fileName);
            } catch (e) {
                throw ("Failed to modify image: " + e);
            }

            try {
                await msg.channel.send({ files: [fileName] });
            } catch (e) {
                throw ("Failed to send response: " + e);
            }

            try {
                await fs.unlink(fileName, () => { });
            } catch (e) {
                console.warn(e);
            }
        }
    }
};