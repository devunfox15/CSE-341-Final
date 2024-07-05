const mongodb = require('../db/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');

const checkId = async (id, db, type) => {
    const objectId = new ObjectId(id);
    const result = await mongodb
        .getDb()
        .db()
        .collection(db)
        .findOne({ _id: objectId });

    console.log(db)
    console.log(objectId)
    console.log(result)
    
    if (!result) {
        throw createError(404, `${type} not found with the given ID`);
    }
};

module.exports = {
    checkId
};