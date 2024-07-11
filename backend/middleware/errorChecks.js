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

  if (!result) {
    throw createError(404, `${type} not found with the given ID`);
  }
};

module.exports = {
  checkId
};
