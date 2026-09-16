import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import { CheckCircle, ChevronLeft, CreditCard, Truck } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock API Call delay
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      clearCart();
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <main className="checkout-page page-container container">
        <div className="order-success glass-panel">
          <CheckCircle size={64} className="success-icon" />
          <h1>Order Confirmed!</h1>
          <p>Thank you, {formData.firstName}. Your order has been successfully placed.</p>
          <p className="order-number">Order # {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <Link to="/shop" className="btn">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className="checkout-page page-container container">
        <div className="checkout-empty glass-panel">
          <h2>Your cart is empty</h2>
          <p>You cannot proceed to checkout without any items.</p>
          <Link to="/shop" className="btn">Return to Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page page-container container">
      <div className="checkout-header">
        <Link to="/cart" className="back-link"><ChevronLeft size={20} /> Back to Cart</Link>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-grid">
        <form className="checkout-form glass-panel" onSubmit={handlePlaceOrder}>
          <section className="form-section">
            <h2>Contact Information</h2>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input type="email" id="email" name="email" required placeholder="you@example.com" value={formData.email} onChange={handleInputChange} />
            </div>
          </section>

          <section className="form-section">
            <h2>Shipping Address</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First name</label>
                <input type="text" id="firstName" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last name</label>
                <input type="text" id="lastName" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" name="address" required placeholder="123 Main St" value={formData.address} onChange={handleInputChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input type="text" id="postalCode" name="postalCode" required value={formData.postalCode} onChange={handleInputChange} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              <label className="payment-method selected">
                <input type="radio" name="payment" defaultChecked />
                <CreditCard size={20} />
                <span>Credit / Debit Card</span>
              </label>
              <label className="payment-method">
                <input type="radio" name="payment" disabled />
                <Truck size={20} />
                <span>Cash on Delivery (Unavailable)</span>
              </label>
            </div>
            <div className="card-mockup">
              <p>This is a demo. No actual payment details are required.</p>
            </div>
          </section>

          <button type="submit" className="btn btn-block place-order-btn" disabled={isProcessing}>
            {isProcessing ? 'Processing Order...' : `Pay ${formatINR(cartTotal)}`}
          </button>
        </form>

        <aside className="checkout-summary glass-panel">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div className="summary-item" key={item.itemId}>
                <div className="summary-item-img">
                  <img src={item.image} alt={item.name} />
                  <span className="summary-item-qty">{item.quantity}</span>
                </div>
                <div className="summary-item-info">
                  <h4>{item.name}</h4>
                  <p>UK {item.size}</p>
                </div>
                <div className="summary-item-price">
                  {formatINR(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>{formatINR(cartTotal)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>
            <div className="total-row final-total">
              <span>Total</span>
              <span>{formatINR(cartTotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Checkout;
