const mongodb = require('../db/database');
const { ObjectId } = require('mongodb');
const createError = require('http-errors');
const { checkId } = require('../middleware/errorChecks');
const { checkOrderIsNotInDB } = require('../middleware/authenticate');

const getAll = async (req, res, next) => {
    //#swagger.tags=['orders']
    //#swagger.summary='Retrieve a list of all orders'
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint retrieves all orders available in the database.'
    try {
        const result = await mongodb
            .getDb()
            .db()
            .collection('orders')
            .find()
            .toArray();

        if (!result.length) {
            return next(createError(400, 'No orders found in the database'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    //#swagger.tags=['orders']
    //#swagger.summary='Get an order by ID'
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint retrieves a specific order by its ID.'
    /* #swagger.parameters['id'] = {
            in: 'path',
            required: 'true',
            value: '650c5812c06bc031e32200a1',
    } */
    try {
        const orderId = req.params.id;

        if (!ObjectId.isValid(orderId)) {
            return next(
                createError(
                    400,
                    'Invalid order ID format. Must be a valid ObjectId'
                )
            );
        }

        const objectId = new ObjectId(orderId);
        const result = await mongodb
            .getDb()
            .db()
            .collection('orders')
            .findOne({ _id: objectId });

        if (!result) {
            return next(createError(404, 'order not found with the given ID'));
        }

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

const createorder = async (req, res, next) => {
    //#swagger.tags=['orders']
    //#swagger.summary='Create a new order'
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint creates a new order in the database.'
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new order.',
        schema: { $ref: '#/definitions/CreateOrder' }
    } */
    try {
        console.log('step 1');
        console.log(req.session.order.id);

        // Ensure order does not already exist in DB, mostly concerned about the order Id rather then a similar order
        await checkOrderIsNotInDB(req.session.order.id);
        console.log('step 3');
        // an id will be automatically generated
        const order = {
            userId: req.body.userId,
            productIds: req.body.productIds,
            totalPrice: req.body.totalPrice,
            orderDate: parseFloat(req.body.orderDate),
            status: req.body.status,
            shippingAddress: req.body.shippingAddress
        };
        console.log(order);

        const response = await mongodb
            .getDb()
            .db()
            .collection('orders')
            .insertOne(order);
        console.table(response);

        if (response.acknowledged) {
            res.status(201).send();
        } else {
            res.status(500).json(
                response.error || 'Failed to create order. Please try again.'
            );
        }
    } catch (error) {
        console.log('step 4');
        next(error);
    }
};

const updateorder = async (req, res, next) => {
    //#swagger.tags=['orders']
    //#swagger.summary='Update an existing order'
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint updates an existing order in the database.'
    /*  #swagger.parameters['body'] = {
        in: 'body',
        description: 'Add new order.',
        schema: { $ref: '#/definitions/UpdateOrder' }
    } */
    try {
        const orderId = req.params.id;

        if (!ObjectId.isValid(orderId)) {
            return next(
                createError(
                    400,
                    'Invalid order ID format. Must be a valid ObjectId'
                )
            );
        }

        const objectId = new ObjectId(orderId);

        const order = {
            userId: req.body.userId,
            productIds: req.body.productIds,
            totalPrice: parseFloat(req.body.totalPrice),
            orderDate: req.body.orderDate,
            status: req.body.status,
            shippingAddress: req.body.shippingAddress
        };

        await checkId(orderId, 'orders', 'order');
        const result = await mongodb
            .getDb()
            .db()
            .collection('orders')
            .replaceOne({ _id: objectId }, order);

        if (result.modifiedCount > 0) {
            res.status(204).send();
        } else {
            return next(
                createError(500, 'Failed to update order. Please try again.')
            );
        }
    } catch (error) {
        next(error);
    }
};

const deleteorder = async (req, res, next) => {
    //#swagger.tags=['orders']
    //#swagger.summary='Delete an order'
    //#swagger.description='Must be Authenticated via Github 1st.  This endpoint deletes a specific order by its ID from the database.'
    try {
        const orderId = req.params.id;

        if (!ObjectId.isValid(orderId)) {
            return next(
                createError(
                    400,
                    'Invalid order ID format. Must be a valid ObjectId'
                )
            );
        }

        const objectId = new ObjectId(orderId);

        await checkId(orderId, 'orders', 'order');

        const result = await mongodb
            .getDb()
            .db()
            .collection('orders')
            .deleteOne({ _id: objectId });

        if (result.deletedCount > 0) {
            res.status(204).send();
        } else {
            return next(
                createError(500, 'Failed to delete order. Please try again.')
            );
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAll,
    getById,
    createorder,
    updateorder,
    deleteorder
};
