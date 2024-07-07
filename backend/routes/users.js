const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { userValidationRules, validate } = require('../middleware/userValidator');
const { isAuthenticated } = require('../middleware/authenticate');
const { isAdmin, isCustomer } = require('../middleware/roles');

//router.get('/', isAuthenticated, isAdmin, userController.getAll);
//router.get('/:id', isAuthenticated, isAdmin, userController.getById);

router.get('/', isAuthenticated, userController.getAll);
router.get('/:id', isAuthenticated, userController.getById);

router.post('/', userValidationRules(), validate, userController.createUser);

router.put('/:id', isAuthenticated, userValidationRules(), validate, userController.updateUser);
router.delete('/:id', isAuthenticated, userController.deleteUser);

module.exports = router;
