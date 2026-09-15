const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');

dotenv.config();

const products = [
  { name: 'CloudFlyer X', description: 'Premium running shoe', price: 159.99, category: 'Running', brand: 'Nike', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', sizes: [8, 9, 10, 11] },
  { name: 'Zoom Pegasus', description: 'Classic running shoe', price: 129.99, category: 'Running', brand: 'Nike', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80', sizes: [8, 9, 10] },
  { name: 'UltraBoost 22', description: 'Maximum comfort running', price: 189.99, category: 'Running', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1584735174965-48c48d7028a9?w=500&q=80', sizes: [9, 10, 11] },
  { name: 'Air Jordan 1', description: 'Iconic basketball shoe', price: 210.00, category: 'Basketball', brand: 'Nike', image: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80', sizes: [9, 10, 11, 12] },
  { name: 'LeBron 19', description: 'High performance basketball', price: 199.99, category: 'Basketball', brand: 'Nike', image: 'https://images.unsplash.com/photo-1605340537586-0a5a4715ecda?w=500&q=80', sizes: [10, 11, 12] },
  { name: 'Curry Flow 9', description: 'Lightweight basketball', price: 159.99, category: 'Basketball', brand: 'Under Armour', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80', sizes: [8, 9, 10] },
  { name: 'Classic Leather', description: 'Everyday casual', price: 85.00, category: 'Casual', brand: 'Reebok', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80', sizes: [7, 8, 9] },
  { name: 'Air Force 1', description: 'Streetwear staple', price: 110.00, category: 'Casual', brand: 'Nike', image: 'https://images.unsplash.com/photo-1595461135849-bf08893fdc2c?w=500&q=80', sizes: [8, 9, 10, 11] },
  { name: 'Stan Smith', description: 'Minimalist casual', price: 95.00, category: 'Casual', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80', sizes: [7, 8, 9] },
  { name: 'Mercurial Superfly', description: 'Elite football boot', price: 249.99, category: 'Football', brand: 'Nike', image: 'https://images.unsplash.com/photo-1611016189569-f19b2a1a8c3e?w=500&q=80', sizes: [9, 10, 11] },
  { name: 'Predator Edge', description: 'Control football boot', price: 229.99, category: 'Football', brand: 'Adidas', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=500&q=80', sizes: [8, 9, 10] },
  { name: 'Future Z 1.3', description: 'Agility football boot', price: 199.99, category: 'Football', brand: 'Puma', image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=500&q=80', sizes: [9, 10] }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shoe-ecommerce');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
