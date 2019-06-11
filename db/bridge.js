const DB_URI = require("../modules/config").SECRETS.DATABASE.URI;
const MongoClient = require('mongodb').MongoClient;

const cache = require("./cache");

module.exports = {
    // Gets document of the guild data from guild collection. If it does not exist it will call createGuildDocument and return the freshly created document
    getGuildDocument: async function (guildId) {
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db
        let docs;
        try {
            docs = await db.collection("guilds").find({ // Find document in the guild collection by guildId and convert that to an array
                guildId: guildId
            }).toArray();
        } catch (e) {
            client.close();
            throw ("Could not get docs from collection: " + e);
        }

        if (docs.length < 1) { // If the array length is less than one (0) - the doc doesn't exist
            let doc;
            try {
                doc = await this.createGuildDocument(guildId);
            } catch (e) {
                client.close();
                throw ("Could not create guildDoc: " + e);
            }

            cache.setCache(guildId, doc); // store the doc in cache

            client.close();
            return doc; // and return that newly created doc.

        } else { // If the guild doc exists
            cache.setCache(guildId, docs[0]); // store the doc in cache

            client.close();
            return docs[0]; // and return that.
        }
    },

    // Creates a doc in the guilds collection based on guildId
    createGuildDocument: async function (guildId) {
        let client;
        try { // To connect to Wanilla mongoDB
            client = await MongoClient.connect(DB_URI);
        } catch (e) {
            throw ("Failed to connect to db: " + e);
        }

        let db = client.db('tea-bot'); // Get tea-bot db

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
        if (err) return console.error(err); // If there's a problem, return.

        console.log(`[DB:DELETEGD] WARNING Deleted guild document [${guildId}]!`.warn);

        try {
            cache.setCache(guildId, false); // Delete guild doc from cache kthx
        } catch (e) {
            console.log("Guild doc was deleted, but the cache failed to update it: " + e);
        }

        client.close();
        return true; // Return with success
    },

    writeGuildDocument: function (guildId, guildDoc) {
        return new Promise((resolve) => {
            cache.setCache(guildId, guildDoc); // store the doc in cache

            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) return console.error(err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("guilds").updateOne({
                    guildId: guildId
                }, {
                    $set: guildDoc
                }, (err) => { // Update doc with guildId
                    if (err) return console.error(err); // If there's a problem, return.
                    resolve(true);
                });
            });
        });
    },

    createStickyMsgDocument: function (documentData) {
        return new Promise((resolve, reject) => {
            // TODO: add checks plz
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("sticky").insertOne(documentData, (err, res) => { // Insert doc with the data of the sticky message to "sticky" collection
                    if (err) reject("Insert error " + err); // If there's a problem, return.

                    resolve(res.ops[0]); // Return the new sticky msg doc
                });
            });
        });
    },

    getExpiredStickyDocs: function (guildId, forceUpdate) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

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

                db.collection("sticky").find(query).toArray((err, docs) => { // 
                    if (err) reject("Connection error " + err); // If there's a problem, return.
                    resolve(docs);
                });
            });
        });
    },

    updateStickyDoc: function (m_id, stickyDocUpdateData) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("sticky").updateOne({
                    m_id: m_id
                }, {
                    $set: stickyDocUpdateData
                }, (err) => { // Update doc with the m_id (message id of the sticky message)
                    if (err) reject("Connection error " + err); // If there's a problem, return.
                    resolve(true);
                });
            });
        });
    },

    deleteStickyDoc: function (m_id) {
        return new Promise((resolve) => {
            // TODO: Add check if m_id is a number
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("sticky").deleteOne({
                    m_id: m_id
                }, (err) => { // Delete sticky doc based on m_id
                    if (err) reject("Connection error " + err); // If there's a problem, return.
                    resolve(true); // Return with success
                });
            });
        });
    },

    deleteAllStickyDocsFromChannel: function (c_id) {
        return new Promise((resolve) => {
            // TODO: Add check if c_id is a number
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("sticky").deleteMany({
                    c_id: c_id
                }, (err) => { // Delete sticky doc based on m_id
                    if (err) reject("Connection error " + err); // If there's a problem, return.
                    resolve(true); // Return with success
                });
            });
        });
    }
};