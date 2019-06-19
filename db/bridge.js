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
    initDB: async function() {
        if(!client || !db) { throw("Database error. !DB!"); }

        try { // To connect to Wanilla mongoDB
            console.log("Connected.");
            connectedClient = await MongoClient.connect(DB_URI, {
                bufferMaxEntries: 0, // If there's an error, throw it instead of waiting on reconnect!
                reconnectTries: Number.MAX_VALUE, // Reconnect as many times as you can! 1.79E+308 should be enough...
                reconnectInterval: 1000, // Try to reconnect every second
                autoReconnect: true,
                useNewUrlParser: true
            });
            
            client = connectedClient;
            db = client.db('tea-bot');
            
            db.on('close', ()=>{
                console.log("Connection closed for some reason. Will try to reconnect.".warn);
                dbConnStatus = 3; // Got disconnected.
            });
            db.on('reconnect', ()=>{
                console.log("Reconnected to db.".success);
                dbConnStatus = 1; // Connected. again.
            });


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


    // Gets document of the guild data from guild collection. If it does not exist it will call createGuildDocument and return the freshly created document
    getGuildDocument: async function (guildId) {
        if (dbConnStatus != 1) { throw("Database error. !DB!"); }

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
                doc = await this.createGuildDocument(guildId);
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
    createGuildDocument: async function (guildId) {
        if (dbConnStatus != 1) { throw("Database error. !DB!"); }

        let res;
        try {
            res = await db.collection("guilds").insertOne({ // Insert doc with guildId to the guilds collection
                guildId: guildId,
                events: []
            });
        } catch (e) {
            client.close();
            throw ("Failed to insert the new guildDoc: " + e);
        }

        client.close();
        return res.ops[0]; // Return the created guild doc
    },

    // Creates a doc in the guilds collection based on guildId
    deleteGuildDocument: async function (guildId) {
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db

        try {
            db.collection("guilds").deleteOne({ // Delete doc with guildId to the guilds collection
                guildId: guildId
            });
        } catch (e) {
            client.close();
            throw ("Could not delete guild document: " + e);
        }

        console.log(`[DB:DELETEGD] WARNING Deleted guild document [${guildId}]!`.warn);

        try {
            cache.setCache(guildId, false); // Delete guild doc from cache kthx
        } catch (e) {
            console.log("Guild doc was deleted, but the cache failed to update it: " + e);
        }

        client.close();
        return true; // Return with success
    },

    writeGuildDocument: async function (guildId, guildDoc) {
        try {
            cache.setCache(guildId, guildDoc); // store the doc in cache
        } catch (e) {
            console.log("Guild doc will be written, but cache refused to store the updated guildDoc:" + e);
        }

        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db
        try {
            await db.collection("guilds").updateOne({ // Update doc
                guildId: guildId // with guildId
            }, {
                $set: guildDoc // with the new updated doc
            });
        } catch (e) {
            client.close();
            throw ("Could not update guildDoc: " + e);
        }

        client.close();
        return true;
    },

    createStickyMsgDocument: async function (documentData) {
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db

        let res;
        try {
            res = await db.collection("sticky").insertOne(documentData); // Insert doc with the data of the sticky message to "sticky" collection
        } catch (e) {
            throw ("Failed to insert stickyMessageDocument");
        }

        return res.ops[0]; // Return the new sticky msg doc
    },

    getExpiredStickyDocs: async function (guildId, forceUpdate) {
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db

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
            client.close();
            throw ("Failed to get expired sticky posts: " + e);
        }

        client.close();
        return docs;
    },

    updateStickyDoc: async function (m_id, stickyDocUpdateData) {
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db

        try {
            await db.collection("sticky").updateOne({
                m_id: m_id
            }, {
                $set: stickyDocUpdateData
            });
        } catch (e) {
            client.close();
            throw (`Failed to update sticky doc [${m_id}] : ${e}`);
        }

        client.close();
        return true; // Return with success
    },

    deleteStickyDoc: async function (m_id) {
        // TODO: Add check if m_id is a number
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db

        try {
            db.collection("sticky").deleteOne({ // Delete sticky doc based on m_id
                m_id: m_id
            });
        } catch (e) {
            client.close();
            throw (`Failed to update sticky doc [${m_id}] : ${e}`);
        }

        client.close();
        return true; // Return with success
    },

    deleteAllStickyDocsFromChannel: async function (c_id) {
        // TODO: Add check if c_id is a number
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db

        try {
            await db.collection("sticky").deleteMany({
                c_id: c_id
            });
        } catch (e) {
            client.close();
            throw(`Failed to delete all sticky docs from channel [${c_id}] : ${e}`);
        }

        client.close();
        return true;
    }
};

module.exports.initDB();