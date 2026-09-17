const Product = require('../models/Product');

const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    const sortedCategories = [...new Set(categories.filter(Boolean))].sort((a, b) => a.localeCompare(b));
    res.json(sortedCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (Admin only ideally)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, images, brand, category, subCategory, tags, sizes } = req.body;

    const mainImage = image || (images && images.length > 0 ? images[0] : 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80');
    const imageList = images && images.length > 0 ? images : [mainImage];

    const product = new Product({
      name,
      description: description || 'The lifestyle sneakers collection is just what you need to complete a sporty look.',
      price: Number(price),
      image: mainImage,
      images: imageList,
      brand: brand || 'Nike',
      category: category || 'Men',
      subCategory: subCategory || 'Shoe',
      tags: tags && tags.length > 0 ? tags : ['Shoe', 'Sneakers', 'Footwear', 'Fashion'],
      sizes: sizes && sizes.length > 0 ? sizes : [7, 8, 9, 10, 11]
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, brand, category } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price ? Number(price) : product.price;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories };
