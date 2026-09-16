import React, { createContext, useContext, useEffect, useState } from 'react';

const CART_STORAGE_KEY = 'shoe-x-cart';

export const CartContext = createContext(null);

const getProductId = (product) => product._id || product.id;

const readStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(readStoredCart);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size) => {
    const productId = getProductId(product);
    const itemId = `${productId}-${size}`;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.itemId === itemId);

      if (existingItem) {
        return currentItems.map((item) => (
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }

      return [
        ...currentItems,
        {
          itemId,
          productId,
          name: product.name,
          brand: product.brand,
          category: product.category,
          price: product.price,
          image: product.image,
          size,
          quantity: 1
        }
      ];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      setCartItems((currentItems) => currentItems.filter((item) => item.itemId !== itemId));
      return;
    }

    setCartItems((currentItems) => currentItems.map((item) => (
      item.itemId === itemId ? { ...item, quantity } : item
    )));
  };

  const removeFromCart = (itemId) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.itemId !== itemId));
  };

  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
};
