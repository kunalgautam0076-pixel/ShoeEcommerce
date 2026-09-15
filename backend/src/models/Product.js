const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // URL to image
  brand: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'Running', 'Casual'
  sizes: [{ type: Number }],
  inStock: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
