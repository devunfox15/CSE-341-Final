const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { userValidationRules, validate } = require('../middleware/userValidator.js');
const { isAuthenticated } = require('../middleware/authenticate.js')

router.get('/', isAuthenticated, userController.getAll);
router.get('/:id', isAuthenticated, userController.getById);
router.post('/', isAuthenticated, userValidationRules(), validate, userController.createUser);
router.put('/:id',  isAuthenticated, userValidationRules(), validate, userController.updateUser);
router.delete('/:id',  isAuthenticated, userController.deleteUser)

module.exports = router;
