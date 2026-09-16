import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export const CartContext = createContext(null);

const getProductId = (product) => product._id || product.id;

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const userKey = user ? (user._id || user.email || user.phone) : 'guest';
  const storageKey = `shoe-x-cart_${userKey}`;

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync cart items whenever active user changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      setCartItems(stored ? JSON.parse(stored) : []);
    } catch {
      setCartItems([]);
    }
  }, [storageKey]);

  // Persist cart changes to the active user's storage key
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cartItems));
  }, [cartItems, storageKey]);

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const addToCart = (product, size) => {
    const productId = getProductId(product);
    const itemId = `${productId}-${size}`;

    let isExisting = false;

    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.itemId === itemId);

      if (existingItem) {
        isExisting = true;
        return currentItems.map((item) => (
          item.itemId === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }

      isExisting = false;
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

    if (isExisting) {
      showToast(`Increased quantity of ${product.name} (Size: ${size})`, 'success');
    } else {
      showToast(`Added ${product.name} (Size: ${size}) to cart!`, 'success');
    }
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
      isCartDrawerOpen,
      openCartDrawer,
      closeCartDrawer,
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
