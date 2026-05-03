import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, bookingsAPI } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session from token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('ep_token');
      const savedCart = localStorage.getItem('ep_cart');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (token) {
        try {
          const userData = await authAPI.getMe();
          setUser(userData);
        } catch {
          localStorage.removeItem('ep_token');
        }
      }
      setAuthLoading(false);
    };
    restoreSession();
  }, []);

  // Fetch bookings whenever user changes
  useEffect(() => {
    if (user) {
      bookingsAPI.getMy()
        .then(setBookings)
        .catch(() => setBookings([]));
    } else {
      setBookings([]);
    }
  }, [user]);

  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('ep_token', data.token);
    setUser(data);
    addNotification('Welcome back, ' + data.name + '!', 'success');
    return data;
  };

  const signup = async (userData) => {
    const data = await authAPI.register(userData);
    localStorage.setItem('ep_token', data.token);
    setUser(data);
    addNotification('Account created successfully!', 'success');
    return data;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setBookings([]);
    localStorage.removeItem('ep_token');
    localStorage.removeItem('ep_cart');
    addNotification('Logged out successfully.', 'info');
  };

  const addToCart = (event, ticketType = 'General', qty = 1) => {
    setCart(prev => {
      const eventId = event._id || event.id;
      const exists = prev.find(i => i.eventId === eventId && i.ticketType === ticketType);
      let updated;
      if (exists) {
        updated = prev.map(i =>
          i.eventId === eventId && i.ticketType === ticketType
            ? { ...i, qty: i.qty + qty }
            : i
        );
      } else {
        updated = [...prev, { eventId, event, ticketType, qty, price: event.price }];
      }
      localStorage.setItem('ep_cart', JSON.stringify(updated));
      return updated;
    });
    addNotification('Ticket added to cart!', 'success');
  };

  const removeFromCart = (eventId, ticketType) => {
    setCart(prev => {
      const updated = prev.filter(i => !(i.eventId === eventId && i.ticketType === ticketType));
      localStorage.setItem('ep_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQty = (eventId, ticketType, qty) => {
    if (qty < 1) { removeFromCart(eventId, ticketType); return; }
    setCart(prev => {
      const updated = prev.map(i =>
        i.eventId === eventId && i.ticketType === ticketType ? { ...i, qty } : i
      );
      localStorage.setItem('ep_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('ep_cart');
  };

  const addBooking = async (bookingData) => {
    try {
      const booking = await bookingsAPI.create(bookingData);
      setBookings(prev => [...prev, booking]);
      return booking;
    } catch (err) {
      // Fallback: store locally if API fails
      const b = {
        ...bookingData,
        _id: 'TKT-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
        createdAt: new Date().toISOString(),
        status: 'confirmed',
      };
      setBookings(prev => [...prev, b]);
      return b;
    }
  };

  const addNotification = (message, type = 'info') => {
    const n = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, n]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(x => x.id !== n.id));
    }, 3500);
  };

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      user, login, signup, logout, authLoading,
      cart, addToCart, removeFromCart, updateCartQty, clearCart, cartCount, cartTotal,
      bookings, addBooking,
      notifications, addNotification,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
