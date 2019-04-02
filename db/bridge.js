const DB_URI = require("../modules/config").SECRETS.DATABASE.URI;
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

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
                            resolve(doc); // and return that newly created doc.
                        });
                    }else{ // If the guild doc exist
                        console.log(`[DB:GGD] DONE Get guild document for [${guildId}]`.success);
                        resolve(docs[0]); // return that.
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

    writeGuildDocument: function(guildId, guildDoc) {
        return new Promise((resolve)=>{
            console.log(`[DB:WGD] WORKING Write guild doc for [${guildId}]`.working);
            console.log(`[DB:WGD] DEBUG About to write this [${guildId}]`.debug);
            console.log(guildDoc);
            MongoClient.connect(DB_URI, (err, client) => { // Connect to Wanilla mongoDB
                if (err) return console.error(err); // If there's a problem, return.

                let db = client.db('tea-bot'); // Get tea-bot db
                db.collection("guilds").updateOne({guildId: guildId}, {$set:guildDoc}, (err, res)=> { // Update doc with guildId
                    if (err) return console.error(err); // If there's a problem, return.

                    console.log(`[DB:WGD] DONE Write guild doc for [${guildId}]`.success);

                    resolve(true);
                });
            });
        });
    }
};