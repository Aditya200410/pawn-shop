import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import cartService from '../services/cartService';
import { toast } from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  // Load cart from backend or localStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isAuthenticated && user && user.email) {
          // Load from backend by email
          const cartData = await cartService.getCart(user.email);
          setCartItems(cartData.items || []);
        } else {
          // Load from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    loadCart();
  }, [isAuthenticated, user]);

  // Save cart to localStorage when not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const addToCart = async (product) => {
    try {
      if (isAuthenticated && user && user.email) {
        // Add to backend by email
        const updatedCart = await cartService.addToCart(product.id, 1, user.email);
        setCartItems(updatedCart.items);
        toast.success('Item added to cart');
      } else {
        // Add to local state
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => (item.productId || item.id) === product.id);
      if (existingItem) {
        const updatedItems = prevItems.map((item) =>
          (item.productId || item.id) === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
            toast.success('Item quantity updated in cart');
        return updatedItems;
      } else {
            toast.success('Item added to cart');
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      if (isAuthenticated && user && user.email) {
        // Remove from backend by email
        const updatedCart = await cartService.removeFromCart(productId, user.email);
        setCartItems(updatedCart.items);
        toast.success('Item removed from cart');
      } else {
        // Remove from local state
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => (item.productId || item.id) !== productId);
          toast.success('Item removed from cart');
      return updatedItems;
    });
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      if (isAuthenticated && user && user.email) {
        // Update in backend by email
        const updatedCart = await cartService.updateQuantity(productId, quantity, user.email);
        setCartItems(updatedCart.items);
        toast.success('Cart updated');
      } else {
        // Update in local state
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        (item.productId || item.id) === productId ? { ...item, quantity } : item
      );
          toast.success('Cart updated');
      return updatedItems;
    });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Failed to update cart');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated && user && user.email) {
        // Clear in backend by email
        await cartService.clearCart(user.email);
        setCartItems([]);
        toast.success('Cart cleared');
      } else {
        // Clear in local state
    setCartItems([]);
        toast.success('Cart cleared');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product?.price || item.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Helper function to get the best available image for a cart item
  const getItemImage = (item) => {
    // If item has images array, use the first one
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    // Otherwise use the single image field
    return item.product?.image || item.image || item.product?.images?.[0];
  };

  // Sync local cart with backend when user logs in
  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated && user && user.email) {
        try {
          const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          if (localCart.length > 0) {
            // Add each local item to backend cart
            for (const item of localCart) {
              await cartService.addToCart(item.id, item.quantity, user.email);
            }
            // Clear local cart
            localStorage.removeItem('cart');
            // Load updated cart from backend
            const cartData = await cartService.getCart(user.email);
            setCartItems(cartData.items || []);
          }
        } catch (error) {
          console.error('Error syncing cart:', error);
          toast.error('Failed to sync cart');
        }
      }
    };
    syncCart();
  }, [isAuthenticated, user]);

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
        loading,
        getItemImage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};