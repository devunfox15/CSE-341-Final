const { body, validationResult } = require('express-validator');

const orderValidationRules = () => {
    return [
        // userId must be a string and is required
        body('userId').isString().notEmpty().withMessage('userId is required'),
        // productIds must be an array and is required
        body('productIds')
            .isArray()
            .notEmpty()
            .withMessage('An Array of productId is required'),
        // totalPrice must be a float and is required
        body('total')
            .isNumeric()
            .withMessage('total is required'),
        // orderDate must be a string and is required
        body('orderDate')
            .isString()
            .notEmpty()
            .withMessage('orderDate is required'),
        // order status must be a string and is required
        body('status')
            .isString()
            .notEmpty()
            .withMessage('shippingAddress is required')
            .matches(/^(Shipped|Processing|Cancelled)$/)
            .withMessage(
                'status must be either "Shipped", "Processing" or "Cancelled"'
            ),
        // address must be a string and is required
        body('shippingAddress')
            .isString()
            .notEmpty()
            .withMessage('address is required')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push(err.msg));

    return res.status(422).json({
        errors: extractedErrors
    });
};

module.exports = {
    orderValidationRules,
    validate
};
