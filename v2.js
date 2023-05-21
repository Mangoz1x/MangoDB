const { MongoClient } = require("mongodb");
let uri = process?.env?.MONGO_URI || require("../app.config.json").mongoUri;

// await api.insertOne({ JSON: "FIELDS" }, "DATABASE", "COLLECTION/TABLE");
exports.insertOne = async (obj, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        obj["documentInsertedMS"] = new Date().getTime();
        const result = await dbo.collection(table).insertOne(obj);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// await api.insertMany([{ JSON: "FIELDS" }, { JSON: "FIELDS" }, { JSON: "FIELDS" }], "DATABASE", "COLLECTION/TABLE");
exports.insertMany = async (arr, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);

        arr = arr.map(indexOfArray => {
            indexOfArray["documentInsertedMS"] = new Date().getTime();
            return indexOfArray;
        });

        const result = await dbo.collection(table).insertMany(arr);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
}

// await api.findOne({ JSON: "FIELDS" }, "DATABASE", "COLLECTION/TABLE");
exports.findOne = async (obj_query, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).findOne(obj_query).toArray();
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// await api.query({ JSON: "FIELDS" }, "DATABASE", "COLLECTION/TABLE");
exports.query = async (obj_query, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).find(obj_query).toArray();
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// await api.queryLimit({ JSON: "FIELDS" }, 10, "DATABASE", "COLLECTION/TABLE");
//                                          ^^ WILL ONLY RETURN 10 RESULTS
exports.queryLimit = async (obj_query, result_limit, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).find(obj_query).limit(result_limit).toArray();
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// await api.queryLimit({ JSON: "FIELDS" }, 10, 10, "DATABASE", "COLLECTION/TABLE");
//                                          ^^ WILL SKIP 10 RESULTS AND RETURN NEXT 10
exports.pagination = async (obj_query, skip, max, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).find(obj_query).skip(skip).limit(max).toArray();
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// await api.sort({ JSON: "FIELDS" }, { FIELD_KEY: 1 }, "DATABASE", "COLLECTION/TABLE");
exports.sort = async (obj_query, sort_obj, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).find(obj_query).sort(sort_obj).toArray();
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// api.deleteOne({ JSON_KEY: "VALUE" }, "DATABASE", "COLLECTION/TABLE");
exports.deleteOne = async (obj_query, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).deleteOne(obj_query);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
}


// api.deleteMany({ JSON_KEY: "/^O/" }, "DATABASE", "COLLECTION/TABLE"); 
//                               ^ delete everything that starts with the letter "O"
exports.deleteMany = async (obj_query, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).deleteMany(obj_query);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// api.updateOne({ FIND_BY_KEY: "WHERE_VALUE_?" }, { $set: { KEY: "VALUE", KEY: "VALUE" } }, "DATABASE", "COLLECTION/TABLE");
exports.updateOne = async (obj_query, new_obj_values, c_db, table) => {
    try {
        if (new_obj_values["$set"]) {
            new_obj_values["$set"]["documentUpdatedMS"] = new Date().getTime();
        } else {
            new_obj_values["$set"] = {
                documentUpdatedMS: new Date().getTime()
            }
        }

        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).updateOne(obj_query, new_obj_values);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

// api.updateMany({ FIND_BY_KEY: "/^S/" }, { $set: { KEY: "VALUE" } }, "DATABASE", "COLLECTION/TABLE");
//                                ^^^^ update everything that starts with the letter "S"
exports.updateMany = async (obj_query, new_obj_values, c_db, table) => {
    try {
        new_obj_values = new_obj_values.map(indexOfArray => {
            if (indexOfArray["$set"]) {
                indexOfArray["$set"]["documentUpdatedMS"] = new Date().getTime();
            } else {
                indexOfArray["$set"] = {
                    documentUpdatedMS: new Date().getTime()
                }
            }

            return indexOfArray;
        });

        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).updateMany(obj_query, new_obj_values);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

exports.collectionCount = async (c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).countDocuments();
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

exports.countDocuments = async (c_db, table, query) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.collection(table).countDocuments(query);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};


module.exports;
