require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Order = require('./src/models/Order');

const products = [
  // Tops
  { name: 'Oversized Cotton Tee', price: 29, description: 'Relaxed-fit crewneck in midweight organic cotton. Washed for a soft, lived-in feel.', category: 'Tops', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', countInStock: 40 },
  { name: 'Silk Blouse', price: 149, description: 'Fluid silk-satin blouse with self-tie neck and relaxed sleeve.', category: 'Tops', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800', countInStock: 18 },
  { name: 'Striped Breton Top', price: 59, description: 'Classic long-sleeve breton in heavyweight cotton jersey.', category: 'Tops', image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800', countInStock: 28 },
  { name: 'Poplin Button-Up Shirt', price: 79, description: 'Crisp cotton poplin shirt with mother-of-pearl buttons.', category: 'Tops', image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800', countInStock: 32 },

  // Bottoms
  { name: 'High-Rise Wide-Leg Jeans', price: 89, description: 'Rigid selvedge denim with a flattering high rise and fluid wide leg.', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800', countInStock: 22 },
  { name: 'Pleated Midi Skirt', price: 95, description: 'Flowing sunray pleats in recycled satin. Elasticated waist for comfort.', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800', countInStock: 24 },
  { name: 'Tailored Wool Trousers', price: 139, description: 'Straight-leg tailored trouser in Italian virgin wool.', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', countInStock: 16 },
  { name: 'Linen Bermuda Shorts', price: 69, description: 'Relaxed mid-thigh bermudas in pure pre-washed linen.', category: 'Bottoms', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800', countInStock: 30 },

  // Dresses
  { name: 'Slip Satin Midi Dress', price: 129, description: 'Bias-cut slip dress with adjustable straps. Effortless drape in silky satin.', category: 'Dresses', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800', countInStock: 18 },
  { name: 'Floral Tiered Maxi Dress', price: 175, description: 'Romantic tiered maxi in lightweight viscose with shirred bodice.', category: 'Dresses', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800', countInStock: 14 },
  { name: 'Knit Sweater Dress', price: 119, description: 'Mini sweater dress in ribbed wool-blend knit. Long sleeves, mock neck.', category: 'Dresses', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800', countInStock: 20 },

  // Outerwear
  { name: 'Wool Overcoat', price: 259, description: 'Double-breasted longline coat in Italian wool blend. Fully lined.', category: 'Outerwear', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800', countInStock: 12 },
  { name: 'Cropped Moto Jacket', price: 229, description: 'Classic biker silhouette in supple lamb leather with asymmetric zip.', category: 'Outerwear', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', countInStock: 10 },
  { name: 'Quilted Puffer Jacket', price: 189, description: 'Lightweight down-fill puffer with water-repellent shell.', category: 'Outerwear', image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800', countInStock: 18 },
  { name: 'Trench Coat', price: 299, description: 'Timeless double-breasted trench in water-resistant gabardine.', category: 'Outerwear', image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800', countInStock: 9 },

  // Knitwear
  { name: 'Cashmere Ribbed Sweater', price: 179, description: 'Ultra-soft pure cashmere knit with ribbed cuffs and hem.', category: 'Knitwear', image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800', countInStock: 16 },
  { name: 'Chunky Cable Cardigan', price: 149, description: 'Oversized cable-knit cardigan with horn buttons.', category: 'Knitwear', image: 'https://images.unsplash.com/photo-1515664069236-68a74c369d97?w=800', countInStock: 14 },
  { name: 'Merino Turtleneck', price: 109, description: 'Fine-gauge merino wool turtleneck. Slim fit.', category: 'Knitwear', image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800', countInStock: 26 },

  // Shoes
  { name: 'Leather Chelsea Boots', price: 219, description: 'Hand-finished full-grain leather with elastic gussets and stacked heel.', category: 'Shoes', image: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800', countInStock: 20 },
  { name: 'Low-Top Leather Sneakers', price: 159, description: 'Minimal leather sneakers with rubber cupsole.', category: 'Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', countInStock: 35 },
  { name: 'Strappy Heeled Sandals', price: 139, description: 'Delicate strappy sandals with 7cm architectural heel.', category: 'Shoes', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', countInStock: 22 },
  { name: 'Loafers in Suede', price: 189, description: 'Penny loafers in plush Italian suede with leather sole.', category: 'Shoes', image: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800', countInStock: 18 },

  // Accessories
  { name: 'Structured Tote Bag', price: 149, description: 'Minimal saffiano leather tote with interior pocket and magnetic closure.', category: 'Accessories', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', countInStock: 30 },
  { name: 'Silk Scarf', price: 69, description: 'Hand-rolled silk twill scarf with painterly print.', category: 'Accessories', image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800', countInStock: 40 },
  { name: 'Leather Belt', price: 89, description: 'Full-grain Italian leather belt with brushed brass buckle.', category: 'Accessories', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583d2?w=800', countInStock: 28 },
  { name: 'Cat-Eye Sunglasses', price: 129, description: 'Acetate cat-eye frame with polarised lenses.', category: 'Accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', countInStock: 24 },
];

const customers = [
  { name: 'Ava Thompson',   email: 'ava@example.com',    password: 'password123' },
  { name: 'Liam Carter',    email: 'liam@example.com',   password: 'password123' },
  { name: 'Sophia Reyes',   email: 'sophia@example.com', password: 'password123' },
  { name: 'Noah Patel',     email: 'noah@example.com',   password: 'password123' },
  { name: 'Mia Nakamura',   email: 'mia@example.com',    password: 'password123' },
];

const sampleAddresses = [
  { fullName: 'Ava Thompson',   address: '14 Mercer Street',    city: 'New York',     postalCode: '10013',    country: 'USA',      phone: '+1 212 555 0142' },
  { fullName: 'Liam Carter',    address: '28 Shoreditch High St', city: 'London',     postalCode: 'E1 6PJ',   country: 'UK',       phone: '+44 20 7946 0998' },
  { fullName: 'Sophia Reyes',   address: 'Calle Gran Vía 45',    city: 'Madrid',       postalCode: '28013',    country: 'Spain',    phone: '+34 91 555 2284' },
  { fullName: 'Noah Patel',     address: '12/3 Linking Road',    city: 'Mumbai',       postalCode: '400050',   country: 'India',    phone: '+91 98200 55511' },
  { fullName: 'Mia Nakamura',   address: '3-6-2 Omotesando',     city: 'Tokyo',        postalCode: '150-0001', country: 'Japan',    phone: '+81 3 5555 9912' },
];

function pickSome(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function buildOrder({ user, address, productsPool, status, placedDaysAgo, deliveredDaysAgo }) {
  const chosen = pickSome(productsPool, 1 + Math.floor(Math.random() * 3));
  const items = chosen.map((p) => {
    const qty = 1 + Math.floor(Math.random() * 2);
    return { product: p._id, name: p.name, image: p.image, price: p.price, qty };
  });
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const placed = daysAgo(placedDaysAgo);
  return {
    user: user._id,
    orderItems: items,
    shippingAddress: address,
    paymentMethod: 'COD',
    status,
    totalPrice: Number(total.toFixed(2)),
    createdAt: placed,
    updatedAt: placed,
    ...(status === 'Delivered' ? { deliveredAt: daysAgo(deliveredDaysAgo) } : {}),
  };
}

async function run() {
  try {
    await connectDB();

    console.log('Clearing collections...');
    await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);

    const admin = await User.create({
      name: process.env.ADMIN_NAME || 'Admin',
      email: (process.env.ADMIN_EMAIL || 'admin@eapp.dev').toLowerCase(),
      password: process.env.ADMIN_PASSWORD || 'admin123',
      isAdmin: true,
    });
    console.log(`Admin created: ${admin.email}`);

    const customerDocs = [];
    for (const c of customers) {
      customerDocs.push(await User.create(c));
    }
    console.log(`Inserted ${customerDocs.length} customers (password: password123)`);

    const productDocs = await Product.insertMany(products);
    console.log(`Inserted ${productDocs.length} products`);

    const orders = [];
    customerDocs.forEach((user, idx) => {
      const address = sampleAddresses[idx % sampleAddresses.length];
      orders.push(buildOrder({ user, address, productsPool: productDocs, status: 'Delivered', placedDaysAgo: 14, deliveredDaysAgo: 9 }));
      orders.push(buildOrder({ user, address, productsPool: productDocs, status: 'Delivered', placedDaysAgo: 7,  deliveredDaysAgo: 3 }));
      orders.push(buildOrder({ user, address, productsPool: productDocs, status: 'Pending',   placedDaysAgo: 2 }));
      if (idx % 2 === 0) {
        orders.push(buildOrder({ user, address, productsPool: productDocs, status: 'Pending', placedDaysAgo: 0 }));
      }
    });

    await Order.insertMany(orders);
    console.log(`Inserted ${orders.length} demo orders (mixed Pending/Delivered)`);

    console.log('\nSeed complete.');
    console.log('---');
    console.log(`Admin login:    ${admin.email} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log(`Customer login: ava@example.com / password123 (and 4 more)`);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
