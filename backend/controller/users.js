const mongodb = require('../db/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const { checkId } = require('../middleware/errorChecks');


const getAll = async (req, res, next) => {
    //#swagger.tags=['Users']
    //#swagger.summary='Retrieve a list of all users'
    //#swagger.description='This endpoint retrieves all users available in the database.'
    try {
        const result = await mongodb.getDb().db().collection('users').find().toArray();

        if (!result.length) {
            return next(createError(400, 'No users found in the database'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    //#swagger.tags=['Users']
    //#swagger.summary='Get an user by ID'
    //#swagger.description='This endpoint retrieves a specific user by its ID.'    
    /* #swagger.parameters['id'] = {
            in: 'path',
            required: 'true',
            value: '650c5812c06bc031e32200a1',
    } */
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return next(createError(400, 'Invalid User ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(userId);
        const result = await mongodb
            .getDb()
            .db()
            .collection('users')
            .findOne({ _id: objectId });

        if (!result) {
            return next(createError(404, 'User not found with the given ID'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const createUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    //#swagger.summary='Create a new user'
    //#swagger.description='This endpoint creates a new user in the database.'    
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user.',
        schema: { $ref: '#/definitions/CreateUser' }
    } */    
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };
        const response = await mongodb.getDb().db().collection('users').insertOne(user);

        if (response.acknowledged) {
            res.status(201).send();
        } else {
            res.status(500).json(response.error || 'Failed to create user. Please try again.');
        }
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    //#swagger.summary='Update an existing user'
    //#swagger.description='This endpoint updates an existing user in the database.'    
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user.',
        schema: { $ref: '#/definitions/UpdateUser' }
    } */
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return next(createError(400, 'Invalid User ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(userId);

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };

        await checkId(userId, "users", "User");
        const result = await mongodb
            .getDb()
            .db()
            .collection('users')
            .replaceOne({ _id: objectId }, user);

        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            return next(createError(500, 'Failed to update user. Please try again.'));
        }
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    //#swagger.tags=['Users']
    //#swagger.summary='Delete an user'
    //#swagger.description='This endpoint deletes a specific user by its ID from the database.'    
    console.log('entering deleteUser controller')
    try {
        const userId = req.params.id;

        if (!ObjectId.isValid(userId)) {
            return next(createError(400, 'Invalid User ID format. Must be a valid ObjectId'));
        }

        const objectId = new ObjectId(userId);

        await checkId(userId, "users", "User");

        const result = await mongodb
            .getDb()
            .db()
            .collection('users')
            .deleteOne({ _id: objectId });

        console.log('result')
        console.table(result)

        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            return next(createError(500, 'Failed to delete user. Please try again.'));
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    createUser,
    updateUser,
    deleteUser
};
