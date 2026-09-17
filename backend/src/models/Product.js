const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Main image URL
  images: [{ type: String }], // Array of additional image URLs
  brand: { type: String, required: true },
  category: { type: String, required: true }, // e.g. 'Men', 'Women', 'Running'
  subCategory: { type: String, default: 'Shoe' }, // e.g. 'Sneaker', 'Running', 'Casual'
  tags: [{ type: String }], // e.g. ['Sneaker', 'Footwear', 'Nike', 'Stylish']
  sizes: [{ type: Number }],
  inStock: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
