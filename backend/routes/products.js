const router = require("express").Router();
const productController = require('../controllers/products');

// List all products (GET)
router.get('/', productController.getAll);

// Show individual product (GET)
router.get('/:id', productController.getById);

// Create new product (POST)
router.post('/', productController.createProduct);

// Update product data (PUT)
router.put('/:id', productController.updateProduct);

// Delete individual product (DELETE)
router.delete('/:id',  productController.deleteProduct)

module.exports = router;
