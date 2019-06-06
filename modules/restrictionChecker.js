
const dbInt = require("../db/interface");
const permChecker = require("./permChecker");

module.exports = {
    checkRestrictions: (handleData)=> {
        return new Promise(async (resolve, reject)=>{
            let doc;
            try { doc = await dbInt.getGuildDoc(handleData.msg.guild.id); } // Awaits the doc from interface
            catch(e) {reject("Could not get guildDoc: " + e); return;}
            
            if (doc.restrictions) { // If there are any restrictions on that doc
                if(Array.isArray(doc.restrictions)) { // check if it's an array (list of user ids that are restricted)
                    if (doc.restrictions.includes(handleData.msg.author.id)) { // If the restrict array has author's id in it = author is restricted.
                        return resolve(false); // Author IS restricted
                    }else{
                        return resolve(true); // Author not restricted
                    }
                }else{ // If it's something else (should be a restriction type)
                    let isPermitted;

                    // TODO: do some global return resolve statement for this duplicate code
                    switch (doc.restrictions) {
                        case "admin": // Admin mode - only admins can use commands
                            isPermitted = await permChecker.admin(handleData); // Awaits response if the user is indeed an admin (bool)
                            if (isPermitted) { // If yes
                                return resolve(true); // is admin
                            }else{
                                return resolve(false); // isn't admin
                            }
                            break;
                        case "dev": // Dev mode - only developers can use commands
                            isPermitted = await permChecker.dev(handleData.msg.author.id); // Await response from perm checker
                            if (isPermitted) { // Same as above
                                return resolve(true);
                            }else{
                                return resolve(false);
                            }
                            break;
                        default:
                            console.log(`[RESTRICTION_CHECKER] Restriction is unclear: ${doc.restrictions}`.warn);
                            return reject(`Restriction is unclear: ${doc.restrictions}`);
                    }
                }
            }else{
                return resolve(true);
            }
        });
    }
};