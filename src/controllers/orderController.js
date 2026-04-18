const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

const placeOrder = asyncHandler(async (req, res) => {
  if (req.user.isAdmin) {
    res.status(403);
    throw new Error('Admins cannot place orders');
  }
  const { orderItems, shippingAddress } = req.body;
  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address required');
  }

  const ids = orderItems.map((i) => i.product);
  const dbProducts = await Product.find({ _id: { $in: ids } });
  const byId = new Map(dbProducts.map((p) => [p._id.toString(), p]));

  const items = [];
  let total = 0;
  for (const i of orderItems) {
    const p = byId.get(String(i.product));
    if (!p) {
      res.status(400);
      throw new Error(`Product not found: ${i.product}`);
    }
    const qty = Math.max(1, Number(i.qty) || 1);
    if (qty > p.countInStock) {
      res.status(400);
      throw new Error(`Insufficient stock for ${p.name}`);
    }
    items.push({ product: p._id, name: p.name, image: p.image, price: p.price, qty });
    total += p.price * qty;
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems: items,
    shippingAddress,
    paymentMethod: 'COD',
    status: 'Pending',
    totalPrice: Number(total.toFixed(2)),
  });

  res.status(201).json(order);
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized');
  }
  res.json(order);
});

const listAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const [total, items] = await Promise.all([
    Order.countDocuments(),
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);
  res.json({ items, page, pages: Math.max(1, Math.ceil(total / limit)), total });
});

const markDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = 'Delivered';
  order.deliveredAt = new Date();
  const saved = await order.save();
  res.json(saved);
});

module.exports = { placeOrder, getMyOrders, getOrderById, listAllOrders, markDelivered };
