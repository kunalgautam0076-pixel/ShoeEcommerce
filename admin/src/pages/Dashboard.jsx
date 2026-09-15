import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error('Error deleting product', error);
        alert('Failed to delete. Make sure backend endpoint is implemented.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard - Products</h1>
      </div>

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="product-cell">
                    <img src={product.image} alt={product.name} />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.category}</td>
                <td>{product.brand}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-danger"
                    onClick={() => deleteProduct(product._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
