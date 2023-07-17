const { MongoClient } = require("mongodb");
let uri = process?.env?.MONGO_URI;

// GRID FS FUNCTIONS
// await mongo.GridFSUpload("test.txt", file, "Justpix", "shipping_labels");
exports.GridFSUpload = async (filename, b64, c_db, c_table, metadata) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);

        const bucket = new mongodb.GridFSBucket(db, { bucketName: c_table });

        const buffer = Buffer.from(b64, 'base64');
        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);

        const custom_id = uuidv4();

        const writeStream = readableStream.pipe(bucket.openUploadStream(custom_id, {
            chunkSizeBytes: readableStream.readableLength,
            metadata: {
                gridfs_custom_id: custom_id,
                name: filename,
                ...(metadata || {})
            }
        }));

        const file = await new Promise((resolve) => {
            writeStream.on("close", (err, file) => {
                resolve(err || file);
            })
        });

        return {
            id: custom_id,
            file: file
        };
    } catch (err) {
        return err;
    }
};

// await mongo.GridFSRead(uploaded.id, "Justpix", "shipping_labels")
exports.GridFSRead = async (id, c_db, c_table) => {
    try {
        const client = new MongoClient(uri);
        const db = client.db(c_db);

        const bucket = new mongodb.GridFSBucket(db, { bucketName: c_table });

        const transformStream = new Transform({
            transform(chunk, encoding, callback) {
                this.push(chunk);
                callback();
            }
        });

        let chunks = [];
        transformStream.on('data', chunk => chunks.push(chunk));

        const rstream = bucket.openDownloadStreamByName(id);
        rstream.on("error", (error) => reject(error));
        rstream.pipe(transformStream);

        const filedata = await new Promise((resolve, reject) => {
            transformStream.on('end', () => {
                const base64 = Buffer.concat(chunks).toString('base64');
                resolve(base64);
            });

            transformStream.on('error', (err) => {
                reject(err);
            });
        });

        return filedata;
    } catch (err) {
        resolve({ error: err.message });
    }

};
// GRID FS FUNCTIONS END

exports.createCollection = async (c_db, name, options = {}) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);

        const result = await dbo.createCollection(name, options);
        client.close();
        return result;
    } catch (err) {
        return err;
    }
};

exports.deleteCollection = async (c_db, name, options = {}) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);
        const result = await dbo.dropCollection(name)
        client.close();
        return result;
    } catch (err) {
        return err;
    }
}

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
        const result = await dbo.collection(table).findOne(obj_query);
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

exports.aggregate = async (obj_query, skip, max, c_db, table) => {
    try {
        const client = new MongoClient(uri);
        const dbo = client.db(c_db);


        const results = await dbo.collection(table).aggregate([
            { $match: obj_query },
            { $skip: skip },
            { $limit: max }
        ]).toArray();

        db.close();
        return results;
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports;
