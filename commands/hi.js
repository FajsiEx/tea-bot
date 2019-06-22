module.exports = {
    handler: async function (handleData) {
        try {
            await handleData.msg.channel.send("Hi!");
        } catch (e) {
            throw (`Failed to send response message: ${e}`);
        }
        return 0;
    }
};