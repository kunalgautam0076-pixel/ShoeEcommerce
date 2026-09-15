const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct, deleteProduct, getCategories } = require('../controllers/productController');

router.get('/categories', getCategories);

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(deleteProduct);

module.exports = router;
