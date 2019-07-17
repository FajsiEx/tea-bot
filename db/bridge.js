const DB_URI = require("../modules/config").SECRETS.DATABASE.URI;
const MongoClient = require('mongodb').MongoClient;

const cache = require("./cache");

let client, db;

// Status:
// 0 - initial: no even attempted to connect yet
// 1 - connected
// 2 - failed to connect in the first place
// 3 - got disconnected
let dbConnStatus = 0;

module.exports = {
    // * Connection management methods

    initDB: async function () {
        try { // To connect to Wanilla mongoDB
            console.log("[DB] Trying to connect to db...".working);
            connectedClient = await MongoClient.connect(DB_URI, {
                bufferMaxEntries: 0, // If there's an error, throw it instead of waiting on reconnect!
                reconnectTries: Number.MAX_VALUE, // Reconnect as many times as you can! 1.79E+308 should be enough...
                reconnectInterval: 1000, // Try to reconnect every second
                autoReconnect: true,
                useNewUrlParser: true
            });

            client = connectedClient;
            db = client.db('tea-bot');

            db.on('close', () => {
                console.log("Connection closed for some reason. Will try to reconnect.".warn);
                dbConnStatus = 3; // Got disconnected.
            });
            db.on('reconnect', () => {
                console.log("Reconnected to db.".success);
                dbConnStatus = 1; // Connected. again.
            });

            console.log("[DB] Connected to the database".success);
            dbConnStatus = 1; // Connected.
            return client;
        } catch (e) {
            dbConnStatus = 2; // Failed to connect.

            client = false;
            db = false;

            console.error("Failed to connect to db! " + e);

            setTimeout(this.initDB, 5000);
            return;
        }
    },

    isDBReady: function () {
        switch (dbConnStatus) {
            case 0:
                console.log("[DBSTAT] Database connection not yet tried".warn);
                return false;
            case 1:
                return true;
            case 2:
                console.log("[DBSTAT] Failed to connect to database. Retrying in the background.".warn);
                return false;
            case 3:
                console.log("[DBSTAT] Got disconnected from the database. Retrying in the background.".warn);
                return false;
            default:
                throw ("Unknown dbConnStat:" + e);
        }
    },

    // * Database interface methods

    guildDoc: {
        // Gets document of the guild data from guild collection. If it does not exist it will call create and return the freshly created document
        get: async function (guildId) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            let docs;
            try {
                docs = await db.collection("guilds").find({ // Find document in the guild collection by guildId and convert that to an array
                    guildId: guildId
                }).toArray();
            } catch (e) {
                throw ("Could not get docs from collection: " + e);
            }

            if (docs.length < 1) { // If the array length is less than one (0) - the doc doesn't exist
                let doc;
                try {
                    doc = await this.create(guildId);
                } catch (e) {
                    throw ("Could not create guildDoc: " + e);
                }

                cache.setCache(guildId, doc); // store the doc in cache
                return doc; // and return that newly created doc.

            } else { // If the guild doc exists
                cache.setCache(guildId, docs[0]); // store the doc in cache
                return docs[0]; // and return that.
            }
        },

        // Creates a doc in the guilds collection based on guildId
        create: async function (guildId) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            let res;
            try {
                res = await db.collection("guilds").insertOne({ // Insert doc with guildId to the guilds collection
                    guildId: guildId,
                    events: []
                });
            } catch (e) {
                throw ("Failed to insert the new guildDoc: " + e);
            }

            return res.ops[0]; // Return the created guild doc
        },

        // Creates a doc in the guilds collection based on guildId
        delete: async function (guildId) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            try {
                db.collection("guilds").deleteOne({ // Delete doc with guildId to the guilds collection
                    guildId: guildId
                });
            } catch (e) {
                throw ("Could not delete guild document: " + e);
            }

            console.log(`[DB:DELETEGD] WARNING Deleted guild document [${guildId}]!`.warn);

            try {
                cache.setCache(guildId, false); // Delete guild doc from cache kthx
            } catch (e) {
                console.log("Guild doc was deleted, but the cache failed to update it: " + e);
            }

            return true; // Return with success
        },

        update: async function (guildId, guildDoc) {
            try {
                cache.setCache(guildId, guildDoc); // store the doc in cache
            } catch (e) {
                console.log("Guild doc will be written, but cache refused to store the updated guildDoc:" + e);
            }

            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            try {
                await db.collection("guilds").updateOne({ // Update doc
                    guildId: guildId // with guildId
                }, {
                        $set: guildDoc // with the new updated doc
                    });
            } catch (e) {
                throw ("Could not update guildDoc: " + e);
            }

            return true;
        },

    },

    stickyDoc: {

        create: async function (documentData) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            let res;
            try {
                res = await db.collection("sticky").insertOne(documentData); // Insert doc with the data of the sticky message to "sticky" collection
            } catch (e) {
                throw ("Failed to insert stickyMessageDocument");
            }

            return res.ops[0]; // Return the new sticky msg doc
        },

        getExpired: async function (guildId, forceUpdate) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            let eventExpiryDeadline = new Date().getTime();
            if (forceUpdate) {
                eventExpiryDeadline = Infinity;
            }

            let query = {
                expiry: {
                    $lte: eventExpiryDeadline
                }
            };
            if (guildId) { // If guildId was specified
                query = {
                    expiry: {
                        $lte: eventExpiryDeadline
                    },
                    g_id: guildId
                };
            }

            let docs;
            try {
                docs = db.collection("sticky").find(query).toArray();
            } catch (e) {
                throw ("Failed to get expired sticky posts: " + e);
            }
            return docs;
        },

        update: async function (m_id, stickyDocUpdateData) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            try {
                await db.collection("sticky").updateOne({
                    m_id: m_id
                }, {
                        $set: stickyDocUpdateData
                    });
            } catch (e) {
                throw (`Failed to update sticky doc [${m_id}] : ${e}`);
            }

            return true; // Return with success
        },

        delete: async function (m_id) {
            if (!parseInt(m_id)) { throw ("m_id is not a snowflake"); }

            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            try {
                db.collection("sticky").deleteOne({ // Delete sticky doc based on m_id
                    m_id: m_id
                });
            } catch (e) {
                throw (`Failed to update sticky doc [${m_id}] : ${e}`);
            }

            return true; // Return with success
        },

        deleteAllFromChannel: async function (c_id) {
            if (!parseInt(c_id)) { throw ("c_id is not a snowflake"); }

            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            try {
                await db.collection("sticky").deleteMany({
                    c_id: c_id
                });
            } catch (e) {
                throw (`Failed to delete all sticky docs from channel [${c_id}] : ${e}`);
            }

            return true;
        }

    },

    triggers: {
        getDocFromToken: async function (token) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            let docs;
            try {
                docs = await db.collection("triggers").find({
                    token: token
                }).toArray();
            } catch (e) {
                throw ("Could not get docs from collection: " + e);
            }

            if (docs.length < 1) {
                throw ("No triggerDoc found.");
            }

            if (docs.length > 1) {
                console.log(`[BRIDGE:TRIGGERS] There is more than one triggerDoc with token: ${token}. Wait, that's illegal.`.warn);
                throw ("More than one triggerDoc found.");
            }

            let triggerDoc = docs[0];

            return triggerDoc;
        },

        createDoc: async function(authorId, channelId) {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }

            try {
                await db.collection("triggers").insertOne({
                    token: 69420,
                    c_id: channelId,
                    author: authorId
                });
            } catch (e) {
                throw ("Failed to insert the new triggerDoc: " + e);
            }

            return true;
        }
    },

    maintenance: {
        killEverything: async function () {
            if (dbConnStatus != 1) { throw ("Database error. !DB!"); }
            
            db.executeDbAdminCommand({ killAllSessions: [{ user: "wanilla", db: "tea-bot" }] });
        }
    }
};

module.exports.initDB();