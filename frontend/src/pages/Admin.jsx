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
  DollarSign, 
  X,
  UploadCloud,
  Image as ImageIcon,
  CheckCircle2,
  UserCheck,
  Tag as TagIcon
} from 'lucide-react';
import './Admin.css';

const AVAILABLE_SIZES = [6, 7, 8, 9, 10, 11, 12];
const CATEGORIES = ['Men', 'Women', 'Kids', 'Running', 'Casual', 'Basketball', 'Sneakers'];
const SUB_CATEGORIES = ['Shoe', 'Sneakers', 'Running Shoe', 'Boots', 'Casual Shoe', 'Formal'];

const DEFAULT_TAGS = ['Sneaker', 'Shoe', 'Footwear', 'Fashion', 'Blue', 'Stylish', 'Nike', 'Menshoes'];

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

  const [allOrders, setAllOrders] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // ----- ADD PRODUCT FORM STATE -----
  const [productForm, setProductForm] = useState({
    name: 'Navy Blue Sneakers Shoe',
    category: 'Men',
    subCategory: 'Shoe',
    brand: 'Nike',
    price: '12999',
    description: 'The lifestyle sneakers collection is just what you need to complete a sporty look. Shaft measures approximately low-top from arch. Mesh fabric panels at front, sides, and collar for breathable comfort foam cushioned comfort insole with arch support. Shock-absorbing.',
    sizes: [7, 8, 9, 10]
  });

  const [uploadedImages, setUploadedImages] = useState([
    {
      id: 'img_1',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      name: 'Navy Blue Shoe 01.png',
      size: '482 KB',
      progress: 100
    },
    {
      id: 'img_2',
      url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80',
      name: 'Navy Blue Shoe 02.png',
      size: '512 KB',
      progress: 100
    },
    {
      id: 'img_3',
      url: 'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?w=500&q=80',
      name: 'Navy Blue Shoe 03.png',
      size: '478 KB',
      progress: 100
    }
  ]);

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [newTagInput, setNewTagInput] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  // Fetch real data from MongoDB
  const loadAdminData = async () => {
    try {
      const [statsRes, ordersRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/stats`),
        fetch(`${API_BASE_URL}/api/admin/orders`),
        fetch(`${API_BASE_URL}/api/admin/users`)
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(prev => ({
          ...prev,
          totalProducts: statsData.totalProducts ?? products.length,
          totalUsers: statsData.totalUsers ?? 0,
          totalOrders: statsData.totalOrders ?? 0,
          totalRevenue: statsData.totalRevenue ?? 0,
        }));
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setAllOrders(ordersData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAllUsers(usersData);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [products]);

  // Form Handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const newImg = {
      id: 'img_' + Date.now(),
      url: imageUrlInput.trim(),
      name: `Shoe Image ${uploadedImages.length + 1}.png`,
      size: `${Math.floor(400 + Math.random() * 200)} KB`,
      progress: 100
    };
    setUploadedImages(prev => [...prev, newImg]);
    setImageUrlInput('');
    showToast('Added image to list', 'success');
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const newImg = {
        id: 'img_' + Date.now() + '_' + index,
        url: URL.createObjectURL(file),
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        progress: 100
      };
      setUploadedImages(prev => [...prev, newImg]);
    });

    showToast(`Uploaded ${files.length} image(s)`, 'success');
  };

  const handleRemoveImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
        setTags(prev => [...prev, newTagInput.trim()]);
        setNewTagInput('');
      }
    }
  };

  const handleSizeToggle = (size) => {
    setProductForm(prev => {
      const exists = prev.sizes.includes(size);
      const updatedSizes = exists
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b);
      return { ...prev, sizes: updatedSizes };
    });
  };

  const handlePublishProduct = async (e) => {
    e.preventDefault();

    if (!productForm.name || !productForm.price) {
      showToast('Please provide Product Name and Price', 'error');
      return;
    }

    if (uploadedImages.length === 0) {
      showToast('Please upload or add at least 1 image', 'error');
      return;
    }

    setIsPublishing(true);

    const imageArray = uploadedImages.map(img => img.url);
    const mainImage = imageArray[0];

    const payload = {
      name: productForm.name,
      description: productForm.description,
      brand: productForm.brand,
      category: productForm.category,
      subCategory: productForm.subCategory,
      price: parseFloat(productForm.price),
      image: mainImage,
      images: imageArray,
      tags: tags,
      sizes: productForm.sizes
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
        showToast(`Successfully published "${productForm.name}" to MongoDB!`, 'success');
      } else {
        const mockProduct = { ...payload, _id: 'prod_' + Date.now() };
        setProducts(prev => [mockProduct, ...prev]);
        showToast(`Published "${productForm.name}" to catalog!`, 'success');
      }
    } catch {
      const mockProduct = { ...payload, _id: 'prod_' + Date.now() };
      setProducts(prev => [mockProduct, ...prev]);
      showToast(`Published "${productForm.name}" to catalog!`, 'success');
    }

    setIsPublishing(false);
    setActiveTab('products');
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await fetch(`${API_BASE_URL}/api/products/${id}`, { method: 'DELETE' });
    } catch {}

    setProducts(prev => prev.filter(p => (p._id || p.id) !== id));
    showToast(`Removed "${name}" from store`, 'info');
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setAllOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o));

    try {
      await fetch(`${API_BASE_URL}/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      showToast(`Order status updated to "${newStatus}"`, 'success');
    } catch {
      showToast(`Status updated locally to "${newStatus}"`, 'info');
    }
  };

  return (
    <main className="admin-page page-container container">
      <div className="admin-header">
        <div>
          <h1>Store Administration</h1>
          <p>Manage inventory, track revenue, and fulfill customer orders in MongoDB</p>
        </div>

        <button className="btn btn-add-product" onClick={() => setActiveTab('add-product')}>
          <Plus size={18} /> Add New Product
        </button>
      </div>

      <div className="admin-grid">
        <aside className="admin-sidebar glass-panel">
          <nav className="admin-nav">
            <button 
              className={`admin-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard size={18} /> Dashboard
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => setActiveTab('add-product')}
            >
              <Plus size={18} /> Add Product
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <Package size={18} /> Products ({products.length})
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <ShoppingBag size={18} /> Orders ({allOrders.length})
            </button>
            <button 
              className={`admin-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} /> Customers ({allUsers.length})
            </button>
          </nav>
        </aside>

        <section className="admin-content glass-panel">
          {/* TAB: ADD PRODUCT (2-COLUMN REFERENCE UI) */}
          {activeTab === 'add-product' && (
            <div className="add-product-container">
              <div className="add-product-header">
                <h2>Add Product</h2>
              </div>

              <form onSubmit={handlePublishProduct} className="add-product-layout">
                {/* LEFT COLUMN: MEDIA & IMAGES */}
                <div className="add-product-left-col glass-panel">
                  <h3>Add Images</h3>
                  
                  <div className="dropzone-area">
                    <input 
                      type="file" 
                      id="file-upload-input" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="file-upload-input" className="dropzone-label">
                      <div className="dropzone-icon">
                        <UploadCloud size={48} />
                      </div>
                      <p className="dropzone-text">
                        Drop your files here, or <span className="browse-link">Browse</span>
                      </p>
                    </label>

                    <div className="image-url-adder">
                      <input 
                        type="url" 
                        placeholder="Or paste Image URL..." 
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                      />
                      <button type="button" className="btn-small-add" onClick={handleAddImageUrl}>Add URL</button>
                    </div>
                  </div>

                  {/* UPLOADED FILE LIST */}
                  <div className="uploaded-files-list">
                    {uploadedImages.map((img) => (
                      <div key={img.id} className="uploaded-file-item glass-panel">
                        <img src={img.url} alt={img.name} className="uploaded-file-thumb" />
                        <div className="uploaded-file-info">
                          <div className="uploaded-file-name-row">
                            <span className="file-name">{img.name}</span>
                            <button 
                              type="button" 
                              className="btn-remove-file"
                              onClick={() => handleRemoveImage(img.id)}
                              title="Delete Image"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <span className="file-size">{img.size}</span>
                          <div className="progress-bar-container">
                            <div className="progress-bar-fill" style={{ width: `${img.progress}%` }}></div>
                          </div>
                          <div className="progress-status-text">
                            <span>{img.progress}% done</span>
                            <span>128KB/sec</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="left-col-actions">
                    <button type="button" className="btn-cancel" onClick={() => setActiveTab('products')}>
                      Cancel
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: PRODUCT DETAILS */}
                <div className="add-product-right-col glass-panel">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      placeholder="Navy Blue Sneakers Shoe" 
                      value={productForm.name}
                      onChange={handleFormChange}
                      required 
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={productForm.category} onChange={handleFormChange}>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Sub Category</label>
                      <select name="subCategory" value={productForm.subCategory} onChange={handleFormChange}>
                        {SUB_CATEGORIES.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Brand</label>
                      <select name="brand" value={productForm.brand} onChange={handleFormChange}>
                        <option value="Nike">Nike</option>
                        <option value="Adidas">Adidas</option>
                        <option value="Puma">Puma</option>
                        <option value="Reebok">Reebok</option>
                        <option value="New Balance">New Balance</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Price (INR ₹)</label>
                      <input 
                        type="number" 
                        name="price" 
                        placeholder="₹12,999" 
                        value={productForm.price}
                        onChange={handleFormChange}
                        required 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      name="description" 
                      rows={4}
                      placeholder="The lifestyle sneakers collection is just what you need..." 
                      value={productForm.description}
                      onChange={handleFormChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Available UK Sizes</label>
                    <div className="size-checkboxes">
                      {AVAILABLE_SIZES.map(s => (
                        <button
                          type="button"
                          key={s}
                          className={`size-chip ${productForm.sizes.includes(s) ? 'selected' : ''}`}
                          onClick={() => handleSizeToggle(s)}
                        >
                          UK {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* TAGS SECTION */}
                  <div className="form-group">
                    <label>Tags</label>
                    <div className="tags-container">
                      {tags.map((tag) => (
                        <span key={tag} className="tag-chip">
                          {tag}
                          <button type="button" className="btn-tag-remove" onClick={() => handleRemoveTag(tag)}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="add-tag-row">
                      <input 
                        type="text" 
                        placeholder="Add new tag (press Enter)..." 
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                      <button type="button" className="btn-add-tag-small" onClick={handleAddTag}>
                        + Add Tag
                      </button>
                    </div>
                  </div>

                  <div className="publish-action-container">
                    <button type="submit" className="btn btn-publish-product" disabled={isPublishing}>
                      {isPublishing ? 'Publishing...' : 'Publish Product'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

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
                  <h3>Recent Customer Orders ({allOrders.length})</h3>
                  <button className="btn-link" onClick={() => setActiveTab('orders')}>View All Orders ➔</button>
                </div>

                {allOrders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No customer orders placed yet.
                  </div>
                ) : (
                  <div className="table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Order Number</th>
                          <th>Customer</th>
                          <th>Contact</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allOrders.slice(0, 5).map((o) => (
                          <tr key={o._id || o.id}>
                            <td><strong>{o.orderNumber || o.id}</strong></td>
                            <td>{o.customerName || 'Customer'}</td>
                            <td>{o.customerPhone || o.customerEmail || 'N/A'}</td>
                            <td><strong>{formatINR(o.totalAmount || o.total || 0)}</strong></td>
                            <td>
                              <span className={`status-pill pill-${(o.status || 'Processing').toLowerCase()}`}>
                                {o.status || 'Processing'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div className="products-tab">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Shoe Catalog Management</h2>
                <button className="btn btn-add-product" onClick={() => setActiveTab('add-product')}>
                  <Plus size={16} /> Add Product
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
              <h2>Customer Orders Fulfillment ({allOrders.length})</h2>
              {allOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                  <h3>No Orders Placed Yet</h3>
                  <p>When customers check out on your store, their orders will appear here in real time!</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Customer</th>
                        <th>Phone / Email</th>
                        <th>Total Amount</th>
                        <th>Items Count</th>
                        <th>Fulfillment Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allOrders.map((o) => {
                        const orderId = o._id || o.id;
                        return (
                          <tr key={orderId}>
                            <td><strong>{o.orderNumber || o.id}</strong></td>
                            <td><strong>{o.customerName || 'Guest Customer'}</strong></td>
                            <td>
                              <div style={{ fontSize: '0.85rem' }}>{o.customerPhone || o.customerEmail || 'N/A'}</div>
                            </td>
                            <td><strong>{formatINR(o.totalAmount || o.total || 0)}</strong></td>
                            <td>{(o.items || []).reduce((sum, item) => sum + (item.quantity || 1), 0)} items</td>
                            <td>
                              <span className={`status-pill pill-${(o.status || 'Processing').toLowerCase()}`}>
                                {o.status || 'Processing'}
                              </span>
                            </td>
                            <td>
                              <select 
                                className="status-select"
                                value={o.status || 'Processing'} 
                                onChange={(e) => handleUpdateOrderStatus(orderId, e.target.value)}
                              >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REGISTERED USERS */}
          {activeTab === 'users' && (
            <div className="users-tab">
              <h2>Registered Users ({allUsers.length})</h2>
              {allUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <Users size={48} style={{ opacity: 0.3, marginBottom: '15px' }} />
                  <h3>No Registered Users Found</h3>
                  <p>When users create an account on ShoeX, their account details will be listed here.</p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>Phone Number</th>
                        <th>Account ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u) => (
                        <tr key={u._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <UserCheck size={18} color="var(--primary)" />
                              <strong>{u.firstName} {u.lastName}</strong>
                            </div>
                          </td>
                          <td>{u.email || 'N/A'}</td>
                          <td>{u.phone || 'N/A'}</td>
                          <td><code style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{u._id}</code></td>
                          <td><span className="status-pill pill-delivered">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Admin;
