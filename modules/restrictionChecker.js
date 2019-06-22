
const dbInt = require("../db/interface");
const permChecker = require("./permChecker");

module.exports = {
    checkRestrictions: async function (handleData) {
        let doc;
        try { doc = await dbInt.getGuildDoc(handleData.msg.guild.id); } // Awaits the doc from interface
        catch (e) { throw ("Could not get guildDoc: " + e); }

        if (!doc.restrictions) { return true; }

        if (Array.isArray(doc.restrictions)) { // check if it's an array (list of user ids that are restricted)
            if (doc.restrictions.includes(handleData.msg.author.id)) { // If the restrict array has author's id in it = author is restricted.
                return false; // Author IS restricted
            } else {
                return true; // Author not restricted
            }
        } else { // If it's something else (should be a restriction type)
            let isPermitted;

            // TODO: do some global return resolve statement for this duplicate code
            switch (doc.restrictions) {
                case "admin": //* Admin mode - only admins can use commands
                    try {
                        isPermitted = await permChecker.admin(handleData); // Awaits response if the user is indeed an admin (bool)
                    } catch (e) {
                        throw ("Couldn't check permissions: " + e);
                    }

                    if (isPermitted) { // If yes
                        return true; // is admin
                    } else {
                        return false; // isn't admin
                    }
                    break;
                case "dev": //* Dev mode - only developers can use commands
                    try {
                        isPermitted = await permChecker.dev(handleData.msg.author.id); // Await response from perm checker
                    } catch (e) {
                        throw ("Couldn't check permissions: " + e);
                    }

                    if (isPermitted) { // Same as above
                        return true;
                    } else {
                        return false;
                    }
                    break;
                default:
                    console.log(`[RESTRICTION_CHECKER] Restriction is unclear: ${doc.restrictions}`.warn);
                    throw (`Restriction is unclear: ${doc.restrictions}`);
            }
        }
    }
};