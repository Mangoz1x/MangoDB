
# MangoDB
Easy to use mongodb library





## Features

- Synchronous MongoDB Queries 
- Easy To use
- Single Line Queries 




## Usage/Examples
Setting up the Library
```
Create "connection_data.json" file in the mangodb directory
Add a URI field to the json file and set the key to your MongoDB Application Connection Url 

Save The File.
```

Importing Module: 
```javascript
const api = require("./mangodb/DBAPI.js");
```


```Usage:```
___
Insert Into MongoDB
```javascript
const RESPONSE = await api.insertOne({ JSON: "FIELDS" }, "DATABASE", "COLLECTION/TABLE");
```

Insert Multiple Items Into MongoDB
```javascript
const RESPONSE = await api.insertMany([{ JSON: "FIELDS" }, { JSON: "FIELDS" }, { JSON: "FIELDS" }], "DATABASE", "COLLECTION/TABLE");
```

Fine One item in MongoDB
```javascript
const RESPONSE = await api.findOne({ JSON: "FIELDS" }, "DATABASE", "COLLECTION/TABLE");
```

Find multiple items in MongoDB
```javascript
const RESPONSE = await api.query({ JSON: "FIELDS" }, "DATABASE", "COLLECTION/TABLE");
```

Find multiple items in MongoDB with a limit as to how many items are returned
```javascript
const RESPONSE = await api.queryLimit({ JSON: "FIELDS" }, 10, "DATABASE", "COLLECTION/TABLE");
```

Return items in mongodb sorted 
```javascript
const RESPONSE = await api.sort({ JSON: "FIELDS" }, { FIELD_KEY: 1 }, "DATABASE", "COLLECTION/TABLE");
```

Delete one item from MongoDB
```javascript
const RESPONSE = await api.deleteOne({ JSON_KEY: "VALUE" }, "DATABASE", "COLLECTION/TABLE");
```

Delete many items from MongoDB
```javascript
const RESPONSE = await api.deleteMany({ JSON_KEY: "/^O/" }, "DATABASE", "COLLECTION/TABLE"); 
```

Update one item in MongoDB
```javascript
const RESPONSE = await api.updateOne({ FIND_BY_KEY: "WHERE_VALUE_?" }, { $set: { KEY: "VALUE", KEY: "VALUE" } }, "DATABASE", "COLLECTION/TABLE");
```

Update many items in MongoDB
```javascript
const RESPONSE = await api.updateMany({ FIND_BY_KEY: "/^S/" }, { $set: { KEY: "VALUE" } }, "DATABASE", "COLLECTION/TABLE");
//                                     ^^^^ update everything that starts with the letter "S"
```

