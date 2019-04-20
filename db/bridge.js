const DB_URI = require("../modules/config").SECRETS.DATABASE.URI;
const MongoClient = require('mongodb').MongoClient;

const cache = require("./cache");

module.exports = {
    // Gets document of the guild data from guild collection. If it does not exist it will call createGuildDocument and return the freshly created document
    getGuildDocument: function(guildId) {
        return new Promise((resolve)=>{
            console.log(`[DB:GGD] WORKING Get guild document for [${guildId}]`.working);
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) return console.error(err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("guilds").find({guildId: guildId}).toArray((err, docs)=> { // Find document in the guild collection by guildId and convert that to an array
                    if (err) return console.error(err); // If there's a problem, return.

                    if (docs.length < 1) { // If the array length is less than one (0) the doc doesn't exist
                        console.log(`[DB:GGD] WARN No guild document for [${guildId}]`.warn);
                        this.createGuildDocument(guildId).then((doc)=>{ // so create it
                            console.log(`[DB:GGD] DONE Get guild document for [${guildId}] - just created`.success);
                            cache.setCache(guildId, doc); // store the doc in cache
                            resolve(doc); // and return that newly created doc.
                        });
                    }else{ // If the guild doc exist
                        console.log(`[DB:GGD] DONE Get guild document for [${guildId}]`.success);
                        cache.setCache(guildId, docs[0]); // store the doc in cache
                        resolve(docs[0]); // and return that.
                    }
                });
            });
        });
    },

    // Creates a doc in the guilds collection based on guildId
    createGuildDocument: function(guildId) {
        return new Promise((resolve)=>{
            console.log(`[DB:CGD] WORKING Create guild doc for [${guildId}]`.working);
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) return console.error(err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("guilds").insertOne({guildId: guildId}, (err, res)=> { // Insert doc with guildId to the guilds collection
                    if (err) return console.error(err); // If there's a problem, return.

                    console.log(`[DB:CGD] DONE Create guild doc for [${guildId}]`.success);

                    resolve(res.ops[0]); // Return the new guild doc
                });
            });
        });
    },

    // Creates a doc in the guilds collection based on guildId
    deleteGuildDocument: function(guildId) {
        return new Promise((resolve)=>{
            console.log(`[DB:DELETEGD] WARNING Deleting guild document [${guildId}] !`.warn);
            console.log(`[DB:DELETEGD] WORKING Delete guild doc for [${guildId}]`.working);
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) return console.error(err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("guilds").deleteOne({guildId: guildId}, (err)=> { // Delete doc with guildId to the guilds collection
                    if (err) return console.error(err); // If there's a problem, return.

                    console.log(`[DB:CGD] DONE Delete guild doc for [${guildId}]`.success);

                    cache.setCache(guildId, false); // Delete guild doc from cache kthx

                    resolve(true); // Return with success
                });
            });
        });
    },

    writeGuildDocument: function(guildId, guildDoc) {
        return new Promise((resolve)=>{
            console.log(`[DB:WGD] WORKING Write guild doc for [${guildId}]`.working);
            console.log(`[DB:WGD] DEBUG About to write this [${guildId}]`.debug);
            console.log(guildDoc);

            cache.setCache(guildId, guildDoc); // store the doc in cache

            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) return console.error(err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("guilds").updateOne({guildId: guildId}, {$set:guildDoc}, (err)=> { // Update doc with guildId
                    if (err) return console.error(err); // If there's a problem, return.

                    console.log(`[DB:WGD] DONE Write guild doc for [${guildId}]`.success);

                    resolve(true);
                });
            });
        });
    },

    createStickyMsgDocument: function(documentData) {
        return new Promise((resolve, reject)=>{
            // TODO: add checks plz
            console.log(`[DB:CSMSGD] WORKING Create sticky msg doc`.working);
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("sticky").insertOne(documentData, (err, res)=> { // Insert doc with the data of the sticky message to "sticky" collection
                    if (err) reject("Insert error " + err); // If there's a problem, return.

                    console.log(`[DB:CSMSGD] DONE Create sticky msg doc`.success);

                    resolve(res.ops[0]); // Return the new sticky msg doc
                });
            });
        });
    },

    getExpiredStickyDocs: function() {
        return new Promise((resolve, reject)=>{
            console.log(`[DB:GESD] WORKING Get expired sticky documents`.working);
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("sticky").find({expiry: {$lte: new Date().getTime()}}).toArray((err, docs)=> { // 
                    if (err) reject("Connection error " + err); // If there's a problem, return.
                    console.log(`[DB:GESD] DONE Get expired sticky documents`.success);
                    resolve(docs);
                });
            });
        });
    },

    updateStickyDoc: function(m_id, stickyDocUpdateData) {
        return new Promise((resolve, reject)=>{
            console.log(`[DB:USD] WORKING Update sticky doc with m_id [${m_id}]`.working);

            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) reject("Connection error " + err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("sticky").updateOne({m_id: m_id}, {$set:stickyDocUpdateData}, (err)=> { // Update doc with the m_id (message id of the sticky message)
                    if (err) reject("Connection error " + err); // If there's a problem, return.

                    console.log(`[DB:USD] DONE Update sticky doc with m_id [${m_id}]`.success);

                    resolve(true);
                });
            });
        });
    }
};