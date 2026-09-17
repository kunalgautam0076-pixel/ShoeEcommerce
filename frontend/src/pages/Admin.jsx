import React, { useState, useEffect, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';
import { API_BASE_URL } from '../config/api';
import { formatINR } from '../utils/currency';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Trash2, 
  TrendingUp, 
  DollarSign, 
  X,
  CheckCircle,
  Clock,
  Truck
} from 'lucide-react';
import './Admin.css';

const AVAILABLE_SIZES = [6, 7, 8, 9, 10, 11, 12];
const CATEGORIES = ['Running', 'Basketball', 'Casual', 'Football', 'Sneakers'];

const Admin = () => {
  const { products, setProducts } = useContext(ProductContext);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: products.length,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    brand: 'Nike',
    category: 'Running',
    price: '',
    image: '',
    sizes: [8, 9, 10]
  });

  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Unable to fetch admin stats');
        }

        setStats({
          totalProducts: data.totalProducts ?? products.length,
          totalUsers: data.totalUsers ?? 0,
          totalOrders: data.totalOrders ?? 0,
          totalRevenue: data.totalRevenue ?? 0,
        });

        setAllOrders(Array.isArray(data.recentOrders) ? data.recentOrders : []);
      } catch {
        setStats(prev => ({
          ...prev,
          totalProducts: products.length,
        }));
        setAllOrders([]);
      }
    };

    fetchAdminData();
  }, [products]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setNewProduct(prev => {
      const exists = prev.sizes.includes(size);
      const updatedSizes = exists
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b);
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image) {
      showToast('Please fill in all required fields (Name, Price, Image)', 'error');
      return;
    }

    const payload = {
      name: newProduct.name,
      description: newProduct.description || 'Premium athletic footwear',
      brand: newProduct.brand,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      image: newProduct.image,
      sizes: newProduct.sizes.length ? newProduct.sizes : [8, 9, 10]
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        setProducts(prev => [data, ...prev]);
        showToast(`Successfully added "${newProduct.name}" to catalog!`, 'success');
      } else {
        // Fallback local state add for demo
        const mockProduct = { ...payload, _id: 'prod_' + Date.now() };
        setProducts(prev => [mockProduct, ...prev]);
        showToast(`Added "${newProduct.name}" to store catalog!`, 'success');
      }
    } catch {
      const mockProduct = { ...payload, _id: 'prod_' + Date.now() };
      setProducts(prev => [mockProduct, ...prev]);
      showToast(`Added "${newProduct.name}" to store catalog!`, 'success');
    }

    setShowAddModal(false);
    setNewProduct({
      name: '',
      description: '',
      brand: 'Nike',
      category: 'Running',
      price: '',
      image: '',
      sizes: [8, 9, 10]
    });
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
    } catch {}

    setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    showToast(`Removed "${name}" from store`, 'info');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Updated ${orderId} status to "${newStatus}"`, 'success');
  };

  const recentOrders = allOrders.length ? allOrders : [
    {
      id: 'No orders yet',
      customerName: 'No customer orders',
      customerContact: 'Orders will appear after checkout',
      date: '—',
      total: 0,
      status: 'Processing',
      itemsCount: 0,
    },
  ];

  return (
    <main className="admin-page page-container container">
      <div className="admin-header">
        <div>
          <h1>Store Administration</h1>
          <p>Manage inventory, track revenue, and fulfill customer orders</p>
        </div>

        <button className="btn btn-add-product" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add New Shoe
        </button>
      </div>

      <div className="admin-grid">
        <aside className="admin-sidebar glass-panel">
          <nav className="admin-nav">
            <button 
              className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} /> Overview Stats
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} /> Products Catalog ({products.length})
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} /> Customer Orders ({allOrders.length})
            </button>
          </nav>
        </aside>

        <section className="admin-content glass-panel">
          {/* TAB 1: OVERVIEW STATS */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <h2>Dashboard Metrics</h2>
              
              <div className="stats-cards">
                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-green">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Total Revenue</span>
                    <h3 className="stat-value">{formatINR(stats.totalRevenue)}</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-orange">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Total Orders</span>
                    <h3 className="stat-value">{stats.totalOrders}</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-blue">
                    <Package size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Active Products</span>
                    <h3 className="stat-value">{products.length}</h3>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon-wrapper icon-purple">
                    <Users size={24} />
                  </div>
                  <div>
                    <span className="stat-label">Registered Users</span>
                    <h3 className="stat-value">{stats.totalUsers}</h3>
                  </div>
                </div>
              </div>

              <div className="recent-orders-section" style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <h3>Recent Customer Activity</h3>
                  <button className="btn-link" onClick={() => setActiveTab('orders')}>View All Orders ➔</button>
                </div>

                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((o) => (
                        <tr key={`${o.id}-${o.customerName}`}>
                          <td><strong>{o.id}</strong></td>
                          <td>{o.customerName}</td>
                          <td>{o.date}</td>
                          <td>{o.total > 0 ? formatINR(o.total) : '—'}</td>
                          <td>
                            <span className={`status-pill pill-${String(o.status || 'processing').toLowerCase()}`}>
                              {o.status || 'Processing'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="products-tab">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Shoe Catalog Management</h2>
                <button className="btn btn-add-product" onClick={() => setShowAddModal(true)}>
                  <Plus size={16} /> Add Shoe
                </button>
              </div>

              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Shoe</th>
                      <th>Brand</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Available Sizes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => {
                      const prodId = p._id || p.id;
                      return (
                        <tr key={prodId}>
                          <td>
                            <div className="table-product-cell">
                              <img src={p.image} alt={p.name} />
                              <div>
                                <strong>{p.name}</strong>
                              </div>
                            </div>
                          </td>
                          <td>{p.brand}</td>
                          <td><span className="category-badge-small">{p.category}</span></td>
                          <td><strong>{formatINR(p.price)}</strong></td>
                          <td>
                            <div className="sizes-pill-group">
                              {(p.sizes || [8,9,10]).map(s => (
                                <span key={s} className="size-badge">UK {s}</span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <button 
                              className="btn-icon-danger"
                              title="Delete Product"
                              onClick={() => handleDeleteProduct(prodId, p.name)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <h2>Customer Order Fulfillment</h2>
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer Details</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Fulfillment Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.length ? allOrders.map((o) => (
                      <tr key={o.id}>
                        <td><strong>{o.id}</strong></td>
                        <td>
                          <div><strong>{o.customerName}</strong></div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.customerContact}</div>
                        </td>
                        <td>{o.date}</td>
                        <td><strong>{formatINR(o.total)}</strong></td>
                        <td>
                          <span className={`status-pill pill-${String(o.status || 'processing').toLowerCase()}`}>
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <select 
                            className="status-select"
                            value={o.status || 'Processing'} 
                            onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                          No orders available yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ADD PRODUCT MODAL */}
      {showAddModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal glass-panel">
            <div className="admin-modal-header">
              <h2>Add New Shoe to Store</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="admin-modal-form">
              <div className="form-group">
                <label>Shoe Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="e.g. Nike Air Max 270" 
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Brand *</label>
                  <select name="brand" value={newProduct.brand} onChange={handleInputChange}>
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="Puma">Puma</option>
                    <option value="Reebok">Reebok</option>
                    <option value="New Balance">New Balance</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={newProduct.category} onChange={handleInputChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (INR ₹) *</label>
                  <input 
                    type="number" 
                    name="price" 
                    placeholder="12999" 
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label>Image URL *</label>
                  <input 
                    type="url" 
                    name="image" 
                    placeholder="https://images.unsplash.com/..." 
                    value={newProduct.image}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  name="description" 
                  placeholder="Lightweight cushioning for maximum comfort..." 
                  value={newProduct.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Available UK Sizes</label>
                <div className="size-checkboxes">
                  {AVAILABLE_SIZES.map(s => (
                    <button
                      type="button"
                      key={s}
                      className={`size-chip ${newProduct.sizes.includes(s) ? 'selected' : ''}`}
                      onClick={() => handleSizeToggle(s)}
                    >
                      UK {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn">
                  Publish Shoe to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Admin;
