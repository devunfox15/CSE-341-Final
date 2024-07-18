const { MongoMemoryServer } = require('mongodb-memory-server');

let _mongoClient;

async function initDb(callback) {
    if (_mongoClient) {
        console.log('MongoDB client is already initialized!');
        return callback(null, _mongoClient);
    }

    try {
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();

        const { MongoClient } = require('mongodb');
        _mongoClient = new MongoClient(mongoUri);

        await _mongoClient.connect();
        callback(null, _mongoClient);
    } catch (err) {
        callback(err);
    }
}

const getDb = () => {
    if (!_mongoClient) {
        throw new Error('MongoDB client is not initialized');
    }
    return _mongoClient;
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
