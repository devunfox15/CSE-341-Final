require('dotenv').config();
const { MongoClient } = require('mongodb');

let _client;

function initDb(callback) {
    if (_client) {
        console.log('DB Client is already initialized!');
        return callback(null, _client);
    }
    MongoClient.connect(process.env.MONGODB_URI)
        .then((client) => {
            _client = client;
            callback(null, _client);
        })
        .catch((err) => {
            callback(err);
        });

    return null;
}

const getDb = () => {
    if (!_client) {
        throw Error('DB Client is not initialized');
    }
    return _client;
};

const getCollection = async (collectionName) => {
    const dbClient = getDb();
    return await dbClient.db().collection(collectionName);
};

module.exports = {
    initDb,
    getDb,
    getCollection
};
