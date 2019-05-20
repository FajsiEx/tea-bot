
const dbInt = require("../db/interface");
const permChecker = require("./permChecker");

module.exports = {
    checkRestrictions: (handleData)=> {
        return new Promise(async (resolve, reject)=>{
            let doc = await dbInt.getGuildDoc(handleData.msg.guild.id); // Awaits the doc from interface

            if (doc.restrictions) { // If there are any restrictions on that doc
                if(Array.isArray(doc.restrictions)) { // check if it's an array (list of user ids that are restricted)
                    console.log("It's an array lol"); // TODO: temp
                }else{ // If it's something else (should be a restriction type)
                    let isPermitted;

                    // TODO: do some global return resolve statement for this duplicate code
                    switch (doc.restrictions) {
                        case "admin": // Admin mode - only admins can use commands
                            isPermitted = await permChecker.admin(handleData); // Awaits response if the user is indeed an admin (bool)
                            if (isPermitted) { // If yes
                                console.log("[RESTRICTION_CHECKER] Admin - success".success);
                                return resolve(true);
                            }else{
                                console.log("[RESTRICTION_CHECKER] Admin - false".debug);
                                return resolve(false);
                            }
                            break;
                        case "dev": // Dev mode - only developers can use commands
                            isPermitted = await permChecker.dev(handleData); // Await response from perm checker
                            if (isPermitted) { // Same as above
                                console.log("[RESTRICTION_CHECKER] Dev - success".success);
                                return resolve(true);
                            }else{
                                console.log("[RESTRICTION_CHECKER] Dev - false".debug);
                                return resolve(false);
                            }
                            break;
                        default:
                            console.log(`[RESTRICTION_CHECKER] Restiction is unclear: ${doc.restrictions}`.warn);
                            return reject(`Restiction is unclear: ${doc.restrictions}`);
                    }
                }
            }
        });
    }
};