
let dClient;

module.exports = {
    init: function(dClientRef) {
        dClient = dClientRef;
    },

    get: function() {
        return new Promise((resolve)=>{
            let guildsCount = dClient.guilds.size;
            let usersCount = dClient.users.size;
            let msgsCount;
            let commandsCount;

            resolve({
                guilds: guildsCount,
                users: usersCount,
                messages: 256,
                commands: 128
            });
        });
    }
};