import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';
import { CheckCircle, ChevronLeft, CreditCard, ShieldCheck, X, QrCode, Smartphone, Building2, Wallet } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Razorpay Demo Modal State
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);
  const [razorpayMethod, setRazorpayMethod] = useState('upi');
  const [isRazorpayPaying, setIsRazorpayPaying] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const finalizeOrder = (orderToSave) => {
    const userKey = user ? (user._id || user.email || user.phone) : 'guest';
    try {
      const ordersKey = `shoe-x-orders_${userKey}`;
      const existingOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      localStorage.setItem(ordersKey, JSON.stringify([orderToSave, ...existingOrders]));
    } catch (err) {
      console.error('Failed to save order to history:', err);
    }

    setConfirmedOrder(orderToSave);
    setIsProcessing(false);
    setIsRazorpayPaying(false);
    setShowRazorpayModal(false);
    setOrderPlaced(true);
    clearCart();
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    const orderNumber = 'SHX-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    
    const newOrder = {
      orderNumber,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      items: [...cartItems],
      total: cartTotal,
      shippingAddress: { ...formData },
      status: 'Processing'
    };

    setPendingOrderData(newOrder);

    try {
      // Create Razorpay Order on Backend
      const res = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: cartTotal })
      });

      const orderData = await res.json();

      // If backend explicitly returned mock order (no API keys set) OR SDK missing, open our interactive Razorpay Modal UI!
      if (orderData.mock || !orderData.key || orderData.key.trim() === '') {
        setIsProcessing(false);
        setShowRazorpayModal(true);
        return;
      }

      // If real Razorpay keys are configured in .env, launch official Razorpay SDK popup window
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShoeX Store',
        description: `Order #${orderNumber}`,
        order_id: orderData.id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#0c2340'
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://localhost:5000/api/payment/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response)
            });

            if (verifyRes.ok) {
              finalizeOrder({ ...newOrder, paymentId: response.razorpay_payment_id });
            } else {
              alert('Payment verification failed.');
              setIsProcessing(false);
            }
          } catch (err) {
            console.error('Payment verification error:', err);
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Backend endpoint error, launching interactive Razorpay Modal UI:', err);
      setIsProcessing(false);
      setShowRazorpayModal(true);
    }
  };

  const handleSimulatedRazorpayPayment = () => {
    setIsRazorpayPaying(true);
    setTimeout(() => {
      if (pendingOrderData) {
        finalizeOrder({
          ...pendingOrderData,
          paymentId: 'pay_mock_' + Math.random().toString(36).substr(2, 9)
        });
      }
    }, 1500);
  };

  if (orderPlaced && confirmedOrder) {
    return (
      <main className="checkout-page page-container container">
        <div className="order-success glass-panel">
          <CheckCircle size={64} className="success-icon" />
          <h1>Order Confirmed!</h1>
          <p>Thank you, {formData.firstName}. Your order has been successfully placed.</p>
          <p className="order-number">Order # {confirmedOrder.orderNumber}</p>

          <div style={{ marginTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
            <Link to="/profile" className="btn btn-outline">View Order History</Link>
            <Link to="/shop" className="btn">Continue Shopping</Link>
          </div>
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
              <label htmlFor="email">Email address / Phone</label>
              <input type="text" id="email" name="email" required placeholder="you@example.com or phone" value={formData.email || formData.phone} onChange={handleInputChange} />
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
                <CreditCard size={18} />
                <span>Razorpay (UPI, Cards, NetBanking, Paytm, PhonePe)</span>
              </label>
            </div>
          </section>

          <button type="submit" className="btn place-order-btn" disabled={isProcessing}>
            {isProcessing ? 'Connecting Razorpay...' : `Pay ${formatINR(cartTotal)}`}
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

      {/* RAZORPAY PAYMENT MODAL UI */}
      {showRazorpayModal && (
        <div className="razorpay-overlay">
          <div className="razorpay-modal">
            <div className="razorpay-header">
              <div className="razorpay-brand">
                <div className="razorpay-logo">R</div>
                <div>
                  <h3>ShoeX Store</h3>
                  <p>Amount: <strong>{formatINR(cartTotal)}</strong></p>
                </div>
              </div>
              <button type="button" className="razorpay-close-btn" onClick={() => setShowRazorpayModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="razorpay-body">
              <div className="razorpay-sidebar">
                <button 
                  type="button" 
                  className={`rzp-nav-item ${razorpayMethod === 'upi' ? 'active' : ''}`}
                  onClick={() => setRazorpayMethod('upi')}
                >
                  <Smartphone size={18} /> UPI / QR
                </button>
                <button 
                  type="button" 
                  className={`rzp-nav-item ${razorpayMethod === 'card' ? 'active' : ''}`}
                  onClick={() => setRazorpayMethod('card')}
                >
                  <CreditCard size={18} /> Card
                </button>
                <button 
                  type="button" 
                  className={`rzp-nav-item ${razorpayMethod === 'netbanking' ? 'active' : ''}`}
                  onClick={() => setRazorpayMethod('netbanking')}
                >
                  <Building2 size={18} /> Netbanking
                </button>
                <button 
                  type="button" 
                  className={`rzp-nav-item ${razorpayMethod === 'wallet' ? 'active' : ''}`}
                  onClick={() => setRazorpayMethod('wallet')}
                >
                  <Wallet size={18} /> Wallet
                </button>
              </div>

              <div className="razorpay-content">
                {razorpayMethod === 'upi' && (
                  <div className="rzp-method-panel">
                    <h4>Pay via UPI</h4>
                    <div className="upi-options">
                      <div className="upi-app"><Smartphone size={24} color="#00baf2" /> Paytm</div>
                      <div className="upi-app"><Smartphone size={24} color="#5f259f" /> PhonePe</div>
                      <div className="upi-app"><Smartphone size={24} color="#ea4335" /> GPay</div>
                    </div>
                    <div className="qr-box">
                      <QrCode size={64} />
                      <p>Scan & Pay with any UPI app</p>
                    </div>
                  </div>
                )}

                {razorpayMethod === 'card' && (
                  <div className="rzp-method-panel">
                    <h4>Card Details</h4>
                    <div className="rzp-input-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="4111 2222 3333 4444" defaultValue="4111222233334444" />
                    </div>
                    <div className="rzp-form-row">
                      <div className="rzp-input-group">
                        <label>Expiry</label>
                        <input type="text" placeholder="12/28" defaultValue="12/28" />
                      </div>
                      <div className="rzp-input-group">
                        <label>CVV</label>
                        <input type="password" placeholder="123" defaultValue="123" maxLength={4} />
                      </div>
                    </div>
                  </div>
                )}

                {razorpayMethod === 'netbanking' && (
                  <div className="rzp-method-panel">
                    <h4>Select Popular Banks</h4>
                    <div className="bank-options">
                      <div className="bank-item">HDFC Bank</div>
                      <div className="bank-item">SBI</div>
                      <div className="bank-item">ICICI Bank</div>
                      <div className="bank-item">Axis Bank</div>
                    </div>
                  </div>
                )}

                {razorpayMethod === 'wallet' && (
                  <div className="rzp-method-panel">
                    <h4>Select Wallet</h4>
                    <div className="bank-options">
                      <div className="bank-item">Mobikwik</div>
                      <div className="bank-item">Freecharge</div>
                      <div className="bank-item">Airtel Money</div>
                    </div>
                  </div>
                )}

                <button 
                  type="button" 
                  className="rzp-pay-submit-btn" 
                  onClick={handleSimulatedRazorpayPayment}
                  disabled={isRazorpayPaying}
                >
                  {isRazorpayPaying ? 'Securing Payment...' : `Pay ${formatINR(cartTotal)}`}
                </button>
              </div>
            </div>

            <div className="razorpay-footer">
              <ShieldCheck size={16} /> Secured by Razorpay 256-bit SSL Encryption
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;
