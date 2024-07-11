const { body, validationResult } = require('express-validator');

const userValidationRules = () => {
  return [
    // fName must be a string and is required
    body('fName').isString().notEmpty().withMessage('fName is required'),
    // lName must be a string and is required
    body('lName').isString().notEmpty().withMessage('lName is required'),
    // email must be an email and is required
    body('email')
      .notEmpty()
      .withMessage('email is required')
      .bail()
      .isEmail()
      .withMessage('Invalid email format'),
    // phone must be a string and is required
    body('phone').isString().notEmpty().withMessage('phone is required'),
    // address must be a string and is required
    body('address').isString().notEmpty().withMessage('address is required'),
    // role must be either 'admin' or 'customer' and is required
    body('role')
      .isString()
      .notEmpty()
      .withMessage('role is required')
      .isIn(['admin', 'customer'])
      .withMessage('role must be either "admin" or "customer"')
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
  userValidationRules,
  validate
};
