module.exports = {
    handler: (handleData) => {
        return new Promise((resolve, reject) => {
            handleData.msg.channel.send("Hi!").then(()=>{
                resolve(0);
            }).catch((e)=>{
                reject("Error sending message: " + e)
            });
        });
    }
}