const model = require('../models/reviews');
const ctrl = {};

ctrl.getAll = async (req, res) => {
    // #swagger.summary = "GET all"
    // #swagger.tags = ["Reviews"]
    try {
        const all = await model.getAll();

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(all);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

ctrl.getSingle = async (req, res) => {
    // #swagger.summary = "GET by id"
    // #swagger.tags = ["Reviews"]
    try {
        const one = await model.getOne(req.params.id);

        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(one);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

ctrl.create = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    // #swagger.description = "This endpoint requires authentication. For logging in visit '/auth' page."

    try {
        const newRecord = {
            userId: req.body.userId,
            productId: req.body.productId,
            rating: req.body.rating,
            comment: req.body.comment,
            reviewDate: req.body.reviewDate
        };
        const result = await model.create(newRecord);

        if (result.success) {
            res.status(201).json(result.response);
        } else {
            res.status(500).json(
                result.error || 'Some error occurred while creating new record.'
            );
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

ctrl.update = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    // #swagger.description = "This endpoint requires authentication. For logging in visit '/auth' page."
    try {
        const record = {
            userId: req.body.userId,
            productId: req.body.productId,
            rating: req.body.rating,
            comment: req.body.comment,
            reviewDate: req.body.reviewDate
        };
        const updateId = req.params.id;
        const result = await model.update(updateId, record);

        if (result.success) {
            res.status(204).send();
        } else {
            res.status(500).json(
                result.error || 'Some error occurred while updating the record.'
            );
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

ctrl.delete = async (req, res) => {
    // #swagger.tags = ["Reviews"]
    // #swagger.description = "This endpoint requires authentication. For logging in visit '/auth' page."
    try {
        const deleteId = req.params.id;
        const result = await model.delete(deleteId);

        if (result.success) {
            res.status(204).send();
        } else {
            res.status(500).json(
                result.error || 'Some error occurred while deleting the record.'
            );
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = ctrl;
