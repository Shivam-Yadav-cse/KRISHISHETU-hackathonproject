import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user || user.role !== 'consumer') return;
    try {
      setCartLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.data);
    } catch (error) {
      console.error('Cart fetch error:', error);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'consumer') fetchCart();
    else setCart({ items: [] });
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await cartAPI.add({ productId, quantity });
      setCart(res.data.data);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await cartAPI.remove(productId);
      setCart(res.data.data);
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await cartAPI.update(productId, { quantity });
      setCart(res.data.data);
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [] });
    } catch (error) {
      console.error(error);
    }
  };

  const cartCount = cart?.items?.length || 0;
  const cartTotal = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, cartLoading, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
