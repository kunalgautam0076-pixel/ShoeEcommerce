import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';
import { User, LogOut, Package, Settings, Clock, CheckCircle2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [userOrders, setUserOrders] = useState([]);

  const userKey = user ? (user._id || user.email || user.phone) : 'guest';

  useEffect(() => {
    if (userKey) {
      try {
        const stored = localStorage.getItem(`shoe-x-orders_${userKey}`);
        setUserOrders(stored ? JSON.parse(stored) : []);
      } catch {
        setUserOrders([]);
      }
    }
  }, [userKey]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <main className="profile-page page-container container">
      <div className="profile-header">
        <h1>My Account</h1>
      </div>

      <div className="profile-grid">
        <aside className="profile-sidebar glass-panel">
          <div className="user-info-card">
            <div className="user-avatar">
              {user.firstName ? user.firstName.charAt(0) : 'U'}{user.lastName ? user.lastName.charAt(0) : ''}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email || user.phone}</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={`profile-nav-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              <User size={18} /> Account Details
            </button>
            <button 
              className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <Package size={18} /> Order History ({userOrders.length})
            </button>
            <button 
              className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> Settings
            </button>
            <button className="profile-nav-btn logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </aside>

        <section className="profile-content glass-panel">
          {activeTab === 'details' && (
            <>
              <h2>Account Details</h2>
              <div className="details-card">
                <div className="detail-group">
                  <label>First Name</label>
                  <p>{user.firstName}</p>
                </div>
                <div className="detail-group">
                  <label>Last Name</label>
                  <p>{user.lastName}</p>
                </div>
                {user.email && (
                  <div className="detail-group">
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>
                )}
                {user.phone && (
                  <div className="detail-group">
                    <label>Phone Number</label>
                    <p>{user.phone}</p>
                  </div>
                )}
                <div className="detail-group">
                  <label>Account Status</label>
                  <p><span className="status-badge">Active</span></p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <>
              <h2>My Orders</h2>
              {userOrders.length === 0 ? (
                <div className="no-orders" style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <Package size={48} style={{ opacity: 0.4, marginBottom: '15px' }} />
                  <h3>No Orders Found</h3>
                  <p style={{ color: 'var(--text-muted)' }}>You haven't placed any orders with this account yet.</p>
                </div>
              ) : (
                <div className="orders-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {userOrders.map((order, index) => (
                    <div key={index} className="order-card glass-panel" style={{ padding: '20px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)' }}>
                      <div className="order-header-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '15px' }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>{order.orderNumber}</strong>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            <Clock size={14} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                            Placed on {order.date}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className="status-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                            <CheckCircle2 size={14} /> {order.status || 'Confirmed'}
                          </span>
                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '6px' }}>
                            {formatINR(order.total)}
                          </div>
                        </div>
                      </div>

                      <div className="order-items-preview" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {order.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <img src={item.image} alt={item.name} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                            <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{item.name}</h4>
                              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Size: UK {item.size} • Qty: {item.quantity}</span>
                            </div>
                            <span style={{ fontWeight: '500' }}>{formatINR(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <h2>Account Settings</h2>
              <p style={{ color: 'var(--text-muted)' }}>Manage your password, notifications, and privacy preferences here.</p>
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Profile;
