import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, openCartDrawer } = useCart();
  const { isAuthenticated } = useAuth();

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar glass-panel">
      <div className="container nav-container">
        <Link to="/" className="logo" onClick={closeMenu}>
          Shoe<span>X</span>
        </Link>
        
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/shop" onClick={closeMenu}>Shop</Link></li>
          <li><Link to="/collections" onClick={closeMenu}>Collections</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        </ul>

        <div className="nav-icons">
          <Link to={isAuthenticated ? "/profile" : "/login"} className="icon-btn" onClick={closeMenu} title={isAuthenticated ? "Profile" : "Sign In"}>
            <User size={20} />
          </Link>
          <button className="icon-btn cart-btn" onClick={() => { closeMenu(); openCartDrawer(); }}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="icon-btn mobile-menu" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
