import React, { createContext, useState, useEffect } from 'react';
import { categories as fallbackCategories, products as fallbackProducts } from '../data';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(fallbackCategories.map((item) => item.name));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/products/categories')
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch product data');
        }

        const data = await productsResponse.json();
        const categoryData = await categoriesResponse.json();

        setProducts(data);
        setCategories(categoryData.length ? categoryData : fallbackCategories.map((item) => item.name));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        setProducts(fallbackProducts);
        setCategories(fallbackCategories.map((item) => item.name));
        console.warn('Backend fetch failed, using fallback product & category data:', err.message);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, categories, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};
