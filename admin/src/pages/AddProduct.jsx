import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Trash2, Pencil, X, Plus, MoreHorizontal, AlertTriangle } from 'lucide-react';

const CATEGORIES = ['Men', 'Women', 'Kids', 'Running', 'Casual', 'Basketball', 'Sneakers'];
const SUB_CATEGORIES = ['Shoe', 'Sneakers', 'Running Shoe', 'Boots', 'Casual Shoe', 'Formal'];
const DEFAULT_TAGS = ['Sneaker', 'Shoe', 'Footwear', 'Fashion', 'Stylish', 'Nike'];
const AVAILABLE_SIZES = [6, 7, 8, 9, 10, 11, 12];
const BRANDS = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance'];

const AddProduct = () => {
  const navigate = useNavigate();

  // Modal toggle state for 2-column Add Product form
  const [showFormModal, setShowFormModal] = useState(false);

  // Products Table State
  const [products, setProducts] = useState([]);
  const [activeActionId, setActiveActionId] = useState(null);

  // Custom Animated Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit Product Modal State
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

  // Add Product Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    brand: 'Nike',
    category: 'Men',
    subCategory: 'Shoe',
    sizes: [7, 8, 9, 10]
  });

  const [uploadedImages, setUploadedImages] = useState([
    {
      id: 'img_1',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
      name: 'Primary Preview Image'
    }
  ]);

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [editingImageId, setEditingImageId] = useState(null);
  const [editUrlInput, setEditUrlInput] = useState('');

  const [tags, setTags] = useState(DEFAULT_TAGS);
  const [newTagInput, setNewTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close action popover menu when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = () => setActiveActionId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    files.forEach((file, index) => {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      const newImg = {
        id: 'img_' + Date.now() + '_' + index,
        url: URL.createObjectURL(file),
        name: cleanName
      };
      setUploadedImages(prev => [...prev, newImg]);
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const newImg = {
      id: 'img_' + Date.now(),
      url: imageUrlInput.trim(),
      name: `Product Image 0${uploadedImages.length + 1}`
    };
    setUploadedImages(prev => [...prev, newImg]);
    setImageUrlInput('');
  };

  const handleRemoveImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleStartEditImage = (img) => {
    setEditingImageId(img.id);
    setEditUrlInput(img.url);
  };

  const handleSaveEditImage = (id) => {
    if (editUrlInput.trim()) {
      setUploadedImages(prev => prev.map(img => img.id === id ? { ...img, url: editUrlInput.trim() } : img));
    }
    setEditingImageId(null);
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
    setFormData(prev => {
      const exists = prev.sizes.includes(size);
      const updated = exists
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size].sort((a, b) => a - b);
      return { ...prev, sizes: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill in Product Name and Price');
      return;
    }

    if (uploadedImages.length === 0) {
      alert('Please upload or add at least 1 image URL');
      return;
    }

    setIsSubmitting(true);
    const imageList = uploadedImages.map(img => img.url);

    const dataToSubmit = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      brand: formData.brand || 'Nike',
      category: formData.category,
      subCategory: formData.subCategory,
      image: imageList[0],
      images: imageList,
      tags: tags,
      sizes: formData.sizes
    };

    try {
      await axios.post('http://localhost:5000/api/products', dataToSubmit);
      setFormData({ name: '', description: '', price: '', brand: 'Nike', category: 'Men', subCategory: 'Shoe', sizes: [7, 8, 9, 10] });
      setShowFormModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

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
      fetchProducts();
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
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setEditingProduct(null);
      fetchProducts();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="add-product-page-dark">
      <div className="page-header-dark" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Store Inventory & Products</h1>
          <p>Manage listed items and create new product entries</p>
        </div>

        {/* THE ONLY + ADD PRODUCT BUTTON */}
        <button className="btn-publish-orange" onClick={() => setShowFormModal(true)}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* PRODUCTS LIST TABLE (MAIN DISPLAY ON SCREEN BY DEFAULT) */}
      <div className="dark-card products-table-card">
        <div className="card-table-header">
          <div className="title-with-purple-dot">
            <span className="purple-dot"></span>
            <h3>Listed Store Products</h3>
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
                    : '17 Sept 2026';
                  
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
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No products listed yet. Click "+ Add Product" to create your first product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2-COLUMN ADD PRODUCT FORM MODAL (STICKY IMAGE SECTION & SCROLLABLE DETAILS ONLY) */}
      {showFormModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-centered add-product-modal-clean">
            <div className="admin-modal-header">
              <h2>Add New Product</h2>
              <button type="button" className="btn-close-modal" onClick={() => setShowFormModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="add-product-container-sticky-split">
              {/* STICKY LEFT COLUMN: IMAGES & UPLOADS */}
              <div className="add-product-card-dark left-card-sticky">
                <h3 className="card-title-dark">Add Product Images</h3>

                <div className="dropzone-box-dark">
                  <input 
                    type="file" 
                    id="file-upload-input-dark" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload-input-dark" className="dropzone-content">
                    <UploadCloud size={52} className="upload-icon-orange" />
                    <p className="dropzone-prompt">
                      Drop your files here, or <span className="browse-text-orange">Browse</span>
                    </p>
                  </label>

                  <div className="url-input-row">
                    <input 
                      type="url" 
                      placeholder="Or paste image URL..." 
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImageUrl())}
                      className="url-input-dark"
                    />
                    <button type="button" className="btn-add-url-orange" onClick={handleAddImageUrl}>
                      Add URL
                    </button>
                  </div>
                </div>

                {/* UPLOADED FILES LIST */}
                <div className="file-list-dark">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="file-item-card-dark">
                      <img src={img.url} alt={img.name} className="file-thumb-dark" />
                      <div className="file-details">
                        <div className="file-header">
                          <span className="file-name-dark">{img.name}</span>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button 
                              type="button" 
                              className="btn-edit-img-dark"
                              onClick={() => handleStartEditImage(img)}
                              title="Edit Image URL"
                            >
                              <Pencil size={14} />
                            </button>

                            <button 
                              type="button" 
                              className="btn-trash-dark"
                              onClick={() => handleRemoveImage(img.id)}
                              title="Delete Image"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        {editingImageId === img.id && (
                          <div className="edit-img-url-box" style={{ marginTop: '8px', display: 'flex', gap: '6px' }}>
                            <input 
                              type="url" 
                              value={editUrlInput}
                              onChange={(e) => setEditUrlInput(e.target.value)}
                              className="url-input-dark"
                              placeholder="New Image URL..."
                            />
                            <button 
                              type="button" 
                              className="btn-add-url-orange" 
                              onClick={() => handleSaveEditImage(img.id)}
                            >
                              Save
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="left-footer">
                  <button type="button" className="btn-cancel-link-dark" onClick={() => setShowFormModal(false)}>
                    Cancel
                  </button>
                </div>
              </div>

              {/* SCROLLABLE RIGHT COLUMN: PRODUCT DETAILS ONLY */}
              <div className="add-product-card-dark right-card-scrollable">
                <h3 className="card-title-dark">Product Details</h3>

                <div className="form-group">
                  <label className="field-label-dark">Product Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    className="form-control-dark" 
                    placeholder="e.g. Navy Blue Sneakers Shoe" 
                    value={formData.name} 
                    required 
                    onChange={handleChange} 
                  />
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label-dark">Category</label>
                    <select name="category" className="form-control-dark" value={formData.category} onChange={handleChange}>
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="field-label-dark">Sub Category</label>
                    <select name="subCategory" className="form-control-dark" value={formData.subCategory} onChange={handleChange}>
                      {SUB_CATEGORIES.map(sc => <option key={sc} value={sc}>{sc}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-group">
                    <label className="field-label-dark">Brand</label>
                    <input 
                      type="text" 
                      name="brand" 
                      className="form-control-dark" 
                      placeholder="e.g. Nike" 
                      value={formData.brand} 
                      required 
                      onChange={handleChange} 
                    />
                  </div>

                  <div className="form-group">
                    <label className="field-label-dark">Price ($)</label>
                    <input 
                      type="number" 
                      name="price" 
                      className="form-control-dark" 
                      placeholder="175" 
                      value={formData.price} 
                      step="0.01" 
                      required 
                      onChange={handleChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="field-label-dark">Description</label>
                  <textarea 
                    name="description" 
                    className="form-control-dark" 
                    rows="4" 
                    placeholder="Enter comprehensive product description..." 
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="field-label-dark">Available UK Sizes</label>
                  <div className="sizes-selector-dark">
                    {AVAILABLE_SIZES.map(size => (
                      <button
                        type="button"
                        key={size}
                        className={`size-btn-dark ${formData.sizes.includes(size) ? 'selected' : ''}`}
                        onClick={() => handleSizeToggle(size)}
                      >
                        UK {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAGS SECTION */}
                <div className="form-group">
                  <label className="field-label-dark">Tags</label>
                  <div className="tags-wrapper-dark">
                    {tags.map((tag) => (
                      <span key={tag} className="tag-badge-dark">
                        {tag}
                        <button type="button" className="tag-remove-btn-dark" onClick={() => handleRemoveTag(tag)}>
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="add-tag-field-dark">
                    <input 
                      type="text" 
                      placeholder="Add custom tag (press Enter)..." 
                      className="form-control-dark"
                      value={newTagInput}
                      onChange={(e) => setNewTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    <button type="button" className="btn-add-tag-dark" onClick={handleAddTag}>
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>

                <div className="submit-row-dark">
                  <button type="submit" className="btn-publish-orange" disabled={isSubmitting}>
                    {isSubmitting ? 'Publishing...' : 'Publish Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="field-label">Category</label>
                  <select name="category" className="form-control" value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label">Brand</label>
                  <select name="brand" className="form-control" value={editFormData.brand} onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}>
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
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
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
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
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
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
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

export default AddProduct;
