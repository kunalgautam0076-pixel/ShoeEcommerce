import React from 'react';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/currency';
import './Cart.css';

const Cart = () => {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();

  if (!cartItems.length) {
    return (
      <main className="cart-page page-container container">
        <div className="cart-empty glass-panel">
          <ShoppingBag size={42} />
          <h1>Your bag is empty</h1>
          <p>Add a pair you love and it will appear here.</p>
          <Link className="cart-continue-btn" to="/shop">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page page-container container">
      <div className="cart-heading">
        <div>
          <p className="eyebrow">Your selection</p>
          <h1>Your Shopping Bag</h1>
        </div>
        <Link className="back-to-shop" to="/shop"><ArrowLeft size={17} /> Continue Shopping</Link>
      </div>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Cart items">
          {cartItems.map((item) => (
            <article className="cart-item glass-panel" key={item.itemId}>
              <Link to={`/product/${item.productId}`} className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="cart-item-details">
                <p className="cart-item-brand">{item.brand}</p>
                <h2>{item.name}</h2>
                <p className="cart-item-category">{item.category} Shoes</p>
                <p className="cart-item-size">UK {item.size}</p>
                <button className="remove-item" type="button" onClick={() => removeFromCart(item.itemId)}>
                  <Trash2 size={16} /> Remove
                </button>
              </div>
              <div className="cart-item-actions">
                <strong>{formatINR(item.price)}</strong>
                <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                  <button type="button" onClick={() => updateQuantity(item.itemId, item.quantity - 1)} aria-label="Decrease quantity">
                    <Minus size={15} />
                  </button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.itemId, item.quantity + 1)} aria-label="Increase quantity">
                    <Plus size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <aside className="cart-summary glass-panel">
          <h2>Summary</h2>
          <div className="summary-row"><span>Subtotal</span><strong>{formatINR(cartTotal)}</strong></div>
          <div className="summary-row"><span>Delivery</span><span className="free-delivery">Free</span></div>
          <div className="summary-total"><span>Total</span><strong>{formatINR(cartTotal)}</strong></div>
          <button className="checkout-btn" type="button">Proceed to Checkout</button>
          <p className="checkout-note">Checkout will be available after payment details are connected.</p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
