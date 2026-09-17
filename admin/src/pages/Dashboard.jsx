import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Pencil, 
  Trash2, 
  X, 
  MoreHorizontal, 
  ShoppingBag, 
  ArrowLeftRight, 
  Package, 
  Bell, 
  Folder
} from 'lucide-react';

const CATEGORIES = ['Running', 'Basketball', 'Casual', 'Football', 'Sneakers', 'Men', 'Women', 'Kids'];
const BRANDS = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'];

const Dashboard = () => {
  const navigate = useNavigate();

  // Data States (Strictly from Backend)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [products, setProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Action Menu State
  const [activeActionId, setActiveActionId] = useState(null);

  // Custom Animated Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: 'Nike',
    category: 'Running',
    subCategory: 'Shoe',
    image: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, prodRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats').catch(() => ({ data: null })),
        axios.get('http://localhost:5000/api/products').catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/admin/orders').catch(() => ({ data: [] }))
      ]);

      if (statsRes.data) {
        setStats(statsRes.data);
      }
      if (prodRes.data) {
        setProducts(prodRes.data);
      }
      if (ordersRes.data) {
        setRecentOrders(ordersRes.data.slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const handleOutsideClick = () => setActiveActionId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Trigger Custom Delete Confirmation Modal
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
  };

  // Perform Custom Animated Delete
  const confirmDeleteProduct = async (id) => {
    setIsDeleting(true);
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProductToDelete(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting product', error);
      alert('Failed to delete product');
      setProductToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      brand: product.brand || 'Nike',
      category: product.category || 'Running',
      subCategory: product.subCategory || 'Shoe',
      image: product.image || ''
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsUpdating(true);
    const prodId = editingProduct._id || editingProduct.id;

    try {
      await axios.put(`http://localhost:5000/api/products/${prodId}`, {
        ...editFormData,
        price: Number(editFormData.price)
      });
      setEditingProduct(null);
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating product:', error);
      fetchDashboardData();
      setEditingProduct(null);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalRevenueFormatted = stats.totalRevenue 
    ? `$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}` 
    : '$0.00';
  
  const avgOrderFormatted = stats.totalOrders > 0 
    ? `$${(stats.totalRevenue / stats.totalOrders).toFixed(2)}` 
    : '$0.00';

  const categoryCounts = products.reduce((acc, p) => {
    const cat = p.category || 'General';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryList = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>Loading live store metrics...</div>;

  return (
    <div className="dashboard-container-dark">
      {/* 1. DASHBOARD TOP HEADER */}
      <div className="dash-top-header">
        <div className="welcome-meta">
          <h1>Welcome Back, Admin!</h1>
          <p>Here's what happening with your store today</p>
        </div>

        <div className="header-user-profile">
          <div className="bell-badge-btn" title="Notifications">
            <Bell size={18} />
            {recentOrders.length > 0 && <span className="bell-dot">{recentOrders.length}</span>}
          </div>

          <div className="admin-avatar-box">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80" alt="Admin" className="avatar-img" />
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME STAT CARDS ROW */}
      <div className="stats-grid-row">
        <div className="stat-dark-card">
          <div className="stat-icon-wrapper icon-orange">
            <ShoppingBag size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Sales</span>
            <h2 className="stat-value">{totalRevenueFormatted}</h2>
          </div>
        </div>

        <div className="stat-dark-card">
          <div className="stat-icon-wrapper icon-purple">
            <ArrowLeftRight size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Average Order Value</span>
            <h2 className="stat-value">{avgOrderFormatted}</h2>
          </div>
        </div>

        <div className="stat-dark-card">
          <div className="stat-icon-wrapper icon-green">
            <Package size={22} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Orders</span>
            <h2 className="stat-value">{stats.totalOrders}</h2>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: REVENUE CHART + REAL TOP CATEGORIES */}
      <div className="middle-grid-row">
        {/* REVENUE CHART CARD */}
        <div className="dark-card chart-card">
          <div className="chart-header">
            <div>
              <span className="chart-subtitle">Live Store Revenue</span>
              <h2 className="chart-title-value">{totalRevenueFormatted}</h2>
            </div>
            <span className="purple-pill-badge">{totalRevenueFormatted}</span>
          </div>

          <div className="chart-visual-container">
            <svg viewBox="0 0 500 180" className="revenue-svg">
              <defs>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path 
                d="M0,140 C60,120 90,90 130,105 C170,120 200,70 250,85 C300,100 330,40 380,55 C430,70 460,40 500,50 L500,180 L0,180 Z" 
                fill="url(#purpleGradient)" 
              />
              <path 
                d="M0,140 C60,120 90,90 130,105 C170,120 200,70 250,85 C300,100 330,40 380,55 C430,70 460,40 500,50" 
                fill="none" 
                stroke="#8b5cf6" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              <circle cx="380" cy="55" r="6" fill="#8b5cf6" stroke="#ffffff" strokeWidth="2.5" />
            </svg>
            <div className="chart-months-row">
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>

        {/* TOP CATEGORIES BREAKDOWN */}
        <div className="dark-card countries-card">
          <h3 className="card-section-title">Top Categories in Store</h3>
          <div className="countries-list">
            {categoryList.length > 0 ? (
              categoryList.map((cat, i) => (
                <div key={i} className="country-row-item">
                  <div className="country-left">
                    <Folder size={18} style={{ color: 'var(--primary)' }} />
                    <span className="country-name">{cat.name}</span>
                  </div>
                  <span className="country-sales-val">{cat.count} items</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No category data available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: REAL TOP SELLING PRODUCTS + REAL RECENT ORDERS */}
      <div className="bottom-grid-row">
        {/* TOP SELLING PRODUCTS TABLE CARD */}
        <div className="dark-card products-table-card">
          <div className="card-table-header">
            <div className="title-with-purple-dot">
              <span className="purple-dot"></span>
              <h3>Top Selling Products</h3>
            </div>
          </div>

          <div className="table-responsive">
            <table className="dark-data-table">
              <thead>
                <tr>
                  <th>Product and Name</th>
                  <th>Date Added</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => {
                    const prodId = product._id || product.id;
                    const dateAdded = product.createdAt 
                      ? new Date(product.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                      : 'Recently Added';
                    
                    const isStock = product.inStock !== false;
                    const formattedPrice = `$${product.price ? product.price.toLocaleString() : '0'}`;

                    return (
                      <tr key={prodId}>
                        <td>
                          <div className="product-cell-dark">
                            <img src={product.image} alt={product.name} className="prod-thumb-dark" />
                            <span className="product-name-bold">{product.name}</span>
                          </div>
                        </td>
                        <td><span className="cell-muted">{dateAdded}</span></td>
                        <td><span className="cell-muted">{product.category}</span></td>
                        <td>
                          <span className={`stock-badge ${isStock ? 'in-stock' : 'out-stock'}`}>
                            {isStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td><span className="price-purple">{formattedPrice}</span></td>
                        <td>
                          <div className="action-cell-container" onClick={(e) => e.stopPropagation()}>
                            <button 
                              type="button"
                              className="btn-action-more-dark"
                              title="Actions"
                              onClick={() => setActiveActionId(activeActionId === prodId ? null : prodId)}
                            >
                              <MoreHorizontal size={18} />
                            </button>

                            {activeActionId === prodId && (
                              <div className="action-popover-menu-dark">
                                <button 
                                  type="button"
                                  className="action-popover-item-dark edit-item"
                                  onClick={() => {
                                    setActiveActionId(null);
                                    handleOpenEditModal(product);
                                  }}
                                >
                                  <Pencil size={14} /> Edit
                                </button>

                                <button 
                                  type="button"
                                  className="action-popover-item-dark delete-item"
                                  onClick={() => {
                                    setActiveActionId(null);
                                    handleOpenDeleteModal(product);
                                  }}
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      No products in database yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* RECENT ORDERS CARD */}
        <div className="dark-card recent-orders-card">
          <h3 className="card-section-title">Recent Orders</h3>
          <div className="orders-list">
            {recentOrders.length > 0 ? (
              recentOrders.map((ord, idx) => {
                const name = ord.user?.name || ord.items?.[0]?.name || `Order #${ord._id?.slice(-5) || idx + 1}`;
                const status = ord.status || 'Pending';
                const price = `$${ord.totalAmount ? ord.totalAmount.toLocaleString() : '0'}`;

                return (
                  <div key={ord._id || idx} className="recent-order-item">
                    <div className="order-item-left">
                      <div className="order-info">
                        <span className="order-name">{name}</span>
                        <span className="order-cat">Status: {status}</span>
                      </div>
                    </div>
                    <strong className="order-price">{price}</strong>
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No recent customer orders placed yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CENTERED EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-centered glass-panel">
            <div className="admin-modal-header">
              <h2>Edit Product Details</h2>
              <button type="button" className="btn-close-modal" onClick={() => setEditingProduct(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="admin-modal-form-grid">
              <div className="form-group">
                <label className="field-label">Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="field-label">Category</label>
                  <select name="category" className="form-control" value={editFormData.category} onChange={handleEditInputChange}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Brand</label>
                  <select name="brand" className="form-control" value={editFormData.brand} onChange={handleEditInputChange}>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="field-label">Price ($)</label>
                  <input 
                    type="number" 
                    name="price" 
                    className="form-control" 
                    value={editFormData.price}
                    onChange={handleEditInputChange}
                    required 
                  />
                </div>

                <div className="form-group">
                  <label className="field-label">Image URL</label>
                  <input 
                    type="url" 
                    name="image" 
                    className="form-control" 
                    value={editFormData.image}
                    onChange={handleEditInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="field-label">Description</label>
                <textarea 
                  name="description" 
                  className="form-control" 
                  rows="3"
                  value={editFormData.description}
                  onChange={handleEditInputChange}
                />
              </div>

              <div className="modal-actions-end">
                <button type="button" className="btn-cancel-link" onClick={() => setEditingProduct(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary-submit" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROPER ANIMATED DELETE CONFIRMATION POPUP IN CENTER */}
      {productToDelete && (
        <div className="admin-modal-overlay">
          <div className="custom-delete-popup-centered">
            <div className="delete-popup-icon-ring">
              <Trash2 size={26} />
            </div>
            <h3 className="delete-popup-title">Delete Product?</h3>
            <p className="delete-popup-desc">
              Are you sure you want to delete <strong style={{ color: '#fff' }}>"{productToDelete.name}"</strong>? This action cannot be undone.
            </p>
            <div className="delete-popup-button-group">
              <button 
                type="button" 
                className="btn-popup-cancel"
                onClick={() => setProductToDelete(null)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn-popup-delete-confirm"
                disabled={isDeleting}
                onClick={() => confirmDeleteProduct(productToDelete._id || productToDelete.id)}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
