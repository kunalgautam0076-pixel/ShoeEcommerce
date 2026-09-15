const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB and seed if empty
const Product = require('./src/models/Product');
const seederData = [
  { name: 'CloudFlyer X', description: 'Premium running shoe', price: 159.99, category: 'Running', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', sizes: [8, 9, 10, 11] },
  { name: 'Zoom Pegasus', description: 'Classic running shoe', price: 129.99, category: 'Running', brand: 'Nike', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80', sizes: [8, 9, 10] },
  { name: 'Air Jordan 1', description: 'Iconic basketball shoe', price: 210.00, category: 'Basketball', brand: 'Nike', image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80', sizes: [9, 10, 11, 12] },
  { name: 'Classic Leather', description: 'Everyday casual', price: 85.00, category: 'Casual', brand: 'Reebok', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80', sizes: [7, 8, 9] },
  { name: 'Mercurial Superfly', description: 'Elite football boot', price: 249.99, category: 'Football', brand: 'Nike', image: 'https://images.unsplash.com/photo-1611016189569-f19b2a1a8c3e?w=500&q=80', sizes: [9, 10, 11] }
];

connectDB().then(async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(seederData);
      console.log('Seeded initial products into in-memory DB');
    }
  } catch (err) {
    console.error('Error seeding DB:', err);
  }
});

// Routes
// app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/products', require('./src/routes/product'));

app.get('/', (req, res) => res.send('API is running...'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
