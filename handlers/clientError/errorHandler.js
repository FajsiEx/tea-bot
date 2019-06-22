/*

    Error handler for discord client errors to prevent unhandled rejects due to ex. unexpected disconnect

*/

module.exports = {
    handler: async function (e) {
        console.log("Discord client encountered an unexpected error".critError);
        console.error(e);
        return 0;
    }
};