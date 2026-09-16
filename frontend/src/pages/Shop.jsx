import React, { useContext } from 'react';
import ProductCard from '../components/ProductCard';
import { ProductContext } from '../context/ProductContext';

const Shop = () => {
  const { products, loading, error } = useContext(ProductContext);

  return (
    <div className="page-container container">
      <div className="page-header">
        <h1>All <span className="highlight">Shoes</span></h1>
        <p>Explore our entire collection of premium footwear.</p>
      </div>

      {error && <p className="data-notice" role="status">Live product service is unavailable. Showing demo products.</p>}
      
      {loading ? (
         <p style={{textAlign: 'center'}}>Loading products...</p>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
