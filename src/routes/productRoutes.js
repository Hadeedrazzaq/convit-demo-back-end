const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);
router.post('/', protect, checkAdmin, createProduct);
router.put('/:id', protect, checkAdmin, updateProduct);
router.delete('/:id', protect, checkAdmin, deleteProduct);

module.exports = router;
