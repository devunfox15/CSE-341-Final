const mongodb = require('../db/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const { checkId } = require('../middleware/errorChecks');


const getAll = async (req, res, next) => {
    //#swagger.tags=['Users']
    //#swagger.summary='Retrieve a list of all users'
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint retrieves all users available in the database.'
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
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint retrieves a specific user by its ID.'    
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
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint creates a new user in the database.'    
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new user.',
        schema: { $ref: '#/definitions/CreateUser' }
    } */    
    try {
        const user = {
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            role: req.body.role,
            githubId: parseInt(req.session.user.id,10)
        };
        console.log(user)
        const response = await mongodb.getDb().db().collection('users').insertOne(user);
        console.table(response)
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
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint updates an existing user in the database.'    
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
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address,
            role: req.body.role,
            githubId: parseInt(req.session.user.id,10)
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
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint deletes a specific user by its ID from the database.'    
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
