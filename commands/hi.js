module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            handleData.msg.channel.send("Hi!").then(()=>{
                return resolve(0);
            }).catch((e)=>{
                return reject("Error sending message: " + e)
            });
        });
    }
}