const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { userValidationRules, validate } = require('../middleware/userValidator.js');
//todo uncomment this when authentication exists
//const { isAuthenticated } = require('../middleware/authenticate.js')

//list all users
router.get('/', userController.getAll);
//list user by id
router.get('/:id', userController.getById);
//create new user



router.post('/', userValidationRules(), validate, userController.createUser);
//update user by id
router.put('/:id',  userValidationRules(), validate, userController.updateUser);
router.delete('/:id',  userController.deleteUser)






//todo  - temporarily commenting out until authentication exists, then remove the lines of code above and uncomment this
//router.post('/', isAuthenticated, userValidationRules(), validate, userController.createUser);
////update user by id
//router.put('/:id',  isAuthenticated, userValidationRules(), validate, userController.updateUser);
//router.delete('/:id',  isAuthenticated, userController.deleteUser)

module.exports = router;
