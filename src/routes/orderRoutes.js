const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  listAllOrders,
  markDelivered,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { checkAdmin } = require('../middleware/adminMiddleware');

const router = express.Router();

router.post('/', protect, placeOrder);
router.get('/mine', protect, getMyOrders);
router.get('/', protect, checkAdmin, listAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/deliver', protect, checkAdmin, markDelivered);

module.exports = router;
