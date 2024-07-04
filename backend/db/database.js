const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
    if (_db) {
        console.log('Db is already initialized!');
    return callback(null, _db);
    }
    MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
        database = client;
        callback(null, database);
    })
    .catch((err) => {
        callback(err);
    //});
    //MongoClient.connect(process.env.MONGODB_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
    //    .then((client) => {
    //        _db = client;
    //        callback(null, _db);
    //})
    //    .catch((err) => {
    //        callback(err);
    });
};

const getDb = () => {
    if (!_db) {
        throw Error('Db not initialized');
    }
    return _db;
    };

module.exports = {
    initDb,
    getDb,
};