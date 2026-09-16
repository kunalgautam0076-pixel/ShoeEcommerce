import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/currency';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card glass-panel">
      <Link to={`/product/${product._id || product.id}`} className="card-link" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="img-container">
          <img src={product.image} alt={product.name} loading="lazy" />
          <span className="category-badge">{product.category}</span>
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-brand">{product.brand}</p>
          <div className="price-row">
            <p className="price">{formatINR(product.price)}</p>
            {/* Using a div instead of button inside a Link to avoid hydration/click issues */}
            <div className="add-cart-btn"><ShoppingCart size={18} /></div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
