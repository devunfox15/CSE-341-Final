const mongodb = require('../db/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const { checkId } = require('../middleware/errorChecks');

const getAll = async (req, res, next) => {
    //#swagger.tags=['Products']
    //#swagger.summary='Get a list of all products.'
    //#swagger.description='Retrieves all products from the database.'
    try {
        const result = await mongodb
            .getDb()
            .db()
            .collection('products')
            .find()
            .toArray();

        if (!result.length) {
            return next(createError(404, 'No product data was found.'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    //#swagger.tags=['Products']
    //#swagger.summary='Get a product by its ID.'
    //#swagger.description='Retrieves data for the specified product.'
    try {
        const productId = req.params.id;

        if (!ObjectId.isValid(productId)) {
            return next(
                createError(
                    400,
                    'Invalid product ID format. Must be a valid ObjectId'
                )
            );
        }

        await checkId(productId, 'products', 'Product');

        const objectId = new ObjectId(productId);
        const response = await mongodb
            .getDb()
            .db()
            .collection('products')
            .findOne({ _id: objectId });

        if (!response) {
            return next(createError(404, 'No such product was found.'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    //#swagger.tags=['Products']
    //#swagger.summary='Create a new product.'
    //#swagger.description='Adds a new product to the database.'
    try {
        const product = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            category: req.body.category,
            size: req.body.size,
            color: req.body.color
        };
        const response = await mongodb
            .getDb()
            .db()
            .collection('products')
            .insertOne(product);

        if (response.acknowledged) {
            res.status(204).send();
        } else {
            res.status(500).json(
                response.error || 'Failed to create the specified product.'
            );
        }
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    //#swagger.tags=['Products']
    //#swagger.summary='Update a product.'
    //#swagger.description='Updates an existing product.'
    try {
        const productId = req.params.id;

        if (!ObjectId.isValid(productId)) {
            return next(
                createError(
                    400,
                    'Invalid product ID format. Must be a valid ObjectId'
                )
            );
        }

        await checkId(productId, 'products', 'Product');

        const product = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            category: req.body.category,
            size: req.body.size,
            color: req.body.color
        };
        const objectId = new ObjectId(productId);
        const response = await mongodb
            .getDb()
            .db()
            .collection('products')
            .replaceOne({ _id: objectId }, product);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            return next(
                createError(500, 'Failed to update the specified product.')
            );
        }
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    //#swagger.tags=['Products']
    //#swagger.summary='Delete a product.'
    //#swagger.description='Deletes the specified product from the database.'
    try {
        const productId = req.params.id;

        if (!ObjectId.isValid(productId)) {
            return next(
                createError(
                    400,
                    'Invalid product ID format. Must be a valid ObjectId'
                )
            );
        }

        await checkId(productId, 'products', 'Product');

        const objectId = new ObjectId(productId);
        const result = await mongodb
            .getDb()
            .db()
            .collection('products')
            .deleteOne({ _id: objectId });

        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            return next(
                createError(500, 'Failed to delete the specified product.')
            );
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    createProduct,
    updateProduct,
    deleteProduct
};
