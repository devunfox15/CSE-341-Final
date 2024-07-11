const { check, validationResult } = require('express-validator');

const requiredStringRule = (fieldName, errorMessage) => {
    return (
        check(fieldName, errorMessage)
            .trim()
            .notEmpty()
            .withMessage(`${fieldName} is required.`)
            .isString()
            // .not()
            // .isNumeric()
            .withMessage(`${fieldName} should be a string`)
    );
};

const validationRules = () => [
    requiredStringRule('userId'),
    requiredStringRule('productId'),
    requiredStringRule('rating'),
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
