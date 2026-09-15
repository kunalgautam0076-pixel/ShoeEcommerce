import React, { useState, useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductContext } from '../context/ProductContext';

const Collections = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const { products, categories, loading } = useContext(ProductContext);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="page-container container">
      <div className="page-header">
        <h1>Our <span className="highlight">Collections</span></h1>
        <p>Filter products by category</p>
      </div>
      
      <div className="filter-tabs">
        <button 
          className={`filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map((cat, index) => (
          <button 
            key={index}
            className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{textAlign: 'center'}}>Loading products...</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Collections;
