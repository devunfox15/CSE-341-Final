const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orders');
const {
    orderValidationRules,
    validate
} = require('../middleware/orderValidator');
const { isAuthenticated } = require('../middleware/authenticate');
const { isAdmin, isCustomer } = require('../middleware/roles');

//router.get('/', isAuthenticated, isAdmin, orderController.getAll);
//router.get('/:id', isAuthenticated, isAdmin, orderController.getById);

router.get('/', isAuthenticated, orderController.getAll);
router.get('/:id', isAuthenticated, orderController.getById);

router.post(
    '/',
    isAuthenticated,
    orderValidationRules(),
    validate,
    orderController.createorder
);

router.put(
    '/:id',
    isAuthenticated,
    orderValidationRules(),
    validate,
    orderController.updateorder
);
router.delete('/:id', isAuthenticated, orderController.deleteorder);

module.exports = router;
