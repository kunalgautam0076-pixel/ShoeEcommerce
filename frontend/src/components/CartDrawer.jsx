import React, { useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import './CartDrawer.css';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    cartTotal, 
    isCartDrawerOpen, 
    closeCartDrawer, 
    updateQuantity, 
    removeFromCart 
  } = useCart();

  const handleCheckout = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  const handleViewCart = () => {
    closeCartDrawer();
    navigate('/cart');
  };

  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartDrawerOpen]);

  if (!isCartDrawerOpen) return null;

  return (
    <>
      <div className="cart-drawer-overlay" onClick={closeCartDrawer} />
      <div className="cart-drawer glass-panel">
        <header className="cart-drawer-header">
          <h2>Your Cart ({cartItems.length})</h2>
          <button className="close-btn" onClick={closeCartDrawer}>
            <X size={24} />
          </button>
        </header>

        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-drawer-empty">
              <ShoppingBag size={48} />
              <h3>Your bag is empty</h3>
              <button className="btn-primary" onClick={closeCartDrawer}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-drawer-items">
              {cartItems.map((item) => (
                <div className="drawer-item" key={item.itemId}>
                  <img src={item.image} alt={item.name} className="drawer-item-image" />
                  <div className="drawer-item-details">
                    <h4>{item.name}</h4>
                    <p>UK {item.size}</p>
                    <div className="drawer-item-actions">
                      <div className="quantity-control">
                        <button onClick={() => updateQuantity(item.itemId, item.quantity - 1)}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.itemId, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                      <button className="remove-btn" onClick={() => removeFromCart(item.itemId)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="drawer-item-price">
                    <strong>{formatINR(item.price * item.quantity)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <footer className="cart-drawer-footer">
            <div className="cart-drawer-total">
              <span>Total:</span>
              <strong>{formatINR(cartTotal)}</strong>
            </div>
            <div className="cart-drawer-actions">
              <button type="button" className="btn-primary btn-block" onClick={handleCheckout}>
                Checkout
              </button>
              <button type="button" className="cart-drawer-link btn-block" onClick={handleViewCart}>
                View Full Cart
              </button>
            </div>
          </footer>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
