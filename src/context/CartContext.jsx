import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        const updatedItems = prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        showToast('Item quantity updated in cart');
        return updatedItems;
      } else {
        showToast('Item added to cart');
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== productId);
      showToast('Item removed from cart', 'info');
      return updatedItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
      showToast('Cart updated');
      return updatedItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Cart cleared', 'info');
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
        toast,
        setToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};