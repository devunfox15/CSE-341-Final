const { check, validationResult } = require('express-validator');

const requiredRule = (fieldName) => {
    return check(fieldName)
        .trim()
        .notEmpty()
        .withMessage(`${fieldName} is required.`);
};

const requiredStringRule = (fieldName, errorMessage) => {
    return requiredRule(fieldName)
        .isString()
        .withMessage(`${fieldName} should be a string`);
};

const validationRules = () => [
    requiredStringRule('userId'),
    requiredStringRule('productId'),
    requiredRule('rating')
        .isNumeric()
        .withMessage('rating should be a number'),
    requiredStringRule('comment'),
    requiredStringRule('reviewDate')
];

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
    validationRules,
    validate
};
