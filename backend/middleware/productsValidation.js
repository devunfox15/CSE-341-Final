const { body, validationResult } = require('express-validator');

const productValidationRules = () => {
    return [
        // Product name must be a string and is required
        body('name')
            .isString()
            .withMessage('Product name must be a string')
            .notEmpty()
            .withMessage('Product name is required'),
            
        // Product description must be an array and is required
        body('description')
            .isString()
            .withMessage('Product description must be a string')
            .notEmpty()
            .withMessage('Product description is required'),

        // Price must be a float and is required
        body('price').isNumeric().withMessage('Price is required'),

        // Product category must be a string and is required
        body('category')
            .isString()
            .withMessage('Product category must to be a string')
            .notEmpty()
            .withMessage('Product category is required'),

        // Size must be a string and is required
        body('size')
            .isString()
            .withMessage('Size must be a string')
            .notEmpty()
            .withMessage('Size is required'),

        // Color must be a string and is required
        body('color')
            .isString()
            .withMessage('Color must be a string')
            .notEmpty()
            .withMessage('Color is required')
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
    productValidationRules,
    validate
};
