import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
          <Link to="/profile" className="icon-btn" onClick={closeMenu}><User size={20} /></Link>
          <Link to="/cart" className="icon-btn cart-btn" onClick={closeMenu}>
            <ShoppingCart size={20} />
            <span className="cart-badge">0</span>
          </Link>
          <button className="icon-btn mobile-menu" onClick={toggleMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
