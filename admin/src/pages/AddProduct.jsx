import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const defaultCategories = ['Running', 'Basketball', 'Casual', 'Football'];

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState(defaultCategories);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    images: '',
    brand: '',
    category: defaultCategories[0]
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/categories');
        const categoryList = response.data && response.data.length ? response.data : defaultCategories;
        setCategories(categoryList);
        setFormData((prev) => ({ ...prev, category: prev.category || categoryList[0] }));
      } catch (error) {
        console.error('Error fetching categories', error);
        setCategories(defaultCategories);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        price: Number(formData.price),
        images: formData.images.split(',').map((image) => image.trim()).filter(Boolean)
      };
      await axios.post('http://localhost:5000/api/products', dataToSubmit);
      alert('Product Added Successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || 'Error adding product');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Add New Product</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" className="form-control" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" className="form-control" rows="3" required onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Price</label>
            <input type="number" name="price" className="form-control" step="0.01" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input type="text" name="image" className="form-control" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Gallery Image URLs (comma-separated)</label>
            <textarea name="images" className="form-control" rows="3" placeholder="https://..., https://..." onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Brand</label>
            <input type="text" name="brand" className="form-control" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              className="form-control"
              list="category-options"
              value={formData.category}
              required
              onChange={handleChange}
            />
            <datalist id="category-options">
              {categories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          <button type="submit" className="btn">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
