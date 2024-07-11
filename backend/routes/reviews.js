const router = require('express').Router();
const controller = require('../controllers/reviews');
const {
    validationRules,
    validate
} = require('../middleware/reviewsValidation');
// const { isAuthenticated } = require("../middleware/reviewAuthenticator");

router.get('/', controller.getAll);

router.get('/:id', controller.getSingle);

router.post('/', validationRules(), validate, controller.create);

router.put('/:id', validationRules(), validate, controller.update);

router.delete('/:id', controller.delete);

module.exports = router;
