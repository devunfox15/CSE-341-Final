const router = require('express').Router();
const productController = require('../controllers/products');
const {
    validationRules,
    validate
} = require('../middleware/reviewsValidation');

// List all products (GET)
router.get('/', productController.getAll);

// Show individual product (GET)
router.get('/:id', productController.getById);

// Create new product (POST)
router.post('/', validationRules(), validate, productController.createProduct);

// Update product data (PUT)
router.put('/:id', validationRules(), validate, productController.updateProduct);

// Delete individual product (DELETE)
router.delete('/:id', productController.deleteProduct);

module.exports = router;
