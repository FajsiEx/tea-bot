/*

    Database module.
    Takes care of saving an loading data.

*/

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const DATABASE_URI = process.env.DATABASE_URI;

module.exports = {
    load: ()=>{ // Loads data from the DB to the memory
        return new Promise((resolve)=>{
            MongoClient.connect(DATABASE_URI, (err, client) => {
                console.log("[LOAD] Loading data...".info);
                if (err) return console.error(err);
                let database = client.db('caj-ministrator');
                database.collection("datav2").find({}).toArray((err, docs)=> {
                    if (err) {console.log(err); return;}
    
                    console.log(`[LOAD] Docs loaded.`.debug);
    
                    let data = docs[0];
                    console.log("[LOAD] Data loaded.".debug);
    
                    client.close();

                    console.log("[LOAD] Load finished. Resloving...".success);
    
                    //resolve(); // This line disables load for testing the save failcheck
                    resolve(data);
                });
            });
        });
    },

    save: (data)=>{
        JSON.stringify(data); // Fails to save if the save object is circular. Rather crash than go weeks unnoticed

        if (!data || (Object.keys(data).length <= 0)) {
            console.warn("[SAVE] Data is false. Aborting save.".warn);
            return false;
        }

        if (data.commandsServed < 1) {
            console.warn("[SAVE] Data is default. Aborting auto-save. To force a save, !fs is your friend.".bgYellow.black);
            return false;
        }

        if (process.env.DISABLE_SAVE == "yes") {
            //console.log("[SAVE] Disable save is on. Aborting save.".warn);
            //return; // temp disable
        } // for beta
        
        console.log("[SAVE] Saving global object...".info);
        
        MongoClient.connect(DATABASE_URI, (err, client) => {
            if (err) return console.error(err);
            let database = client.db('caj-ministrator');

            // Replace the object with your field objectid...because it won't work otherwise...
            database.collection("datav2").updateOne({"_id" : ObjectId("5c2ceed4f25f7b062cd2e038")}, {
                $set: data
            });

            console.log("[SAVE] Everything saved.".success);

            client.close(); // Dont dos yourself kids
        });
    }
};