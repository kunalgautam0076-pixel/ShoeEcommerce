import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductContext } from '../context/ProductContext';
import './Home.css';

const Home = () => {
  const { products, categories, loading } = useContext(ProductContext);
  const featuredProducts = products.slice(0, 10);
  const categoryCards = categories.map((categoryName, index) => ({
    id: index + 1,
    name: categoryName,
    image: `https://images.unsplash.com/photo-${index === 0 ? '1542291026-7eec264c27ff' : index === 1 ? '1597045566677-8cf032ed6634' : index === 2 ? '1525966222134-fcfa99b8ae77' : '1611016189569-f19b2a1a8c3e'}?w=500&q=80`
  }));

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-content">
          <div className="hero-text">
            <h1>Step Into The <span className="highlight">Future</span></h1>
            <p>Discover our latest collection of premium footwear designed for ultimate comfort and unmatched style. Elevate your journey today.</p>
            <div className="hero-btns">
              <Link to="/shop" className="btn">Shop Now</Link>
              <Link to="/collections" className="btn btn-outline">View Collections</Link>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="circle-bg"></div>
            <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Premium Red Shoe" className="hero-shoe" />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <h2>Shop by <span className="highlight">Category</span></h2>
          <div className="category-grid">
            {categoryCards.map(category => (
              <Link to={`/collections?category=${category.name}`} key={category.id} className="category-card">
                <img src={category.image} alt={category.name} />
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="section featured-section">
        <div className="container">
          <h2>Trending <span className="highlight">Now</span></h2>
          {loading ? (
             <p style={{textAlign: 'center'}}>Loading products...</p>
          ) : (
            <div className="product-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
          <div className="view-all-container">
             <Link to="/shop" className="btn btn-outline view-all-btn">View All Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
