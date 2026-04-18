const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

const listProducts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 8));
  const filter = req.query.category ? { category: req.query.category } : {};
  const [total, items] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  ]);
  res.json({ items, page, pages: Math.max(1, Math.ceil(total / limit)), total });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, image, countInStock } = req.body;
  const product = await Product.create({ name, price, description, category, image, countInStock });
  res.status(201).json(product);
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const fields = ['name', 'price', 'description', 'category', 'image', 'countInStock'];
  for (const f of fields) {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  }
  const saved = await product.save();
  res.json(saved);
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ message: 'Product removed' });
});

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
